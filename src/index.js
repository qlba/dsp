require('bootstrap/dist/css/bootstrap.min.css');

const _ = require('lodash');
const React = require('react');
const ReactDOM = require('react-dom');
const Reactstrap = require('reactstrap');
const BarChart = require('./components/BarChart');
const LineChart = require('./components/LineChart');
const {DFT, FFTtime, FFTfreq, FFTlib, Goertzel} = require('./fourier');

const {
	Container,
	Row,
	Col,
	Table
} = Reactstrap;

function benchmark(subroutine)
{
	const start = performance.now();

	subroutine();

	return (performance.now() - start) / 1000 || 0.001;
}

function L345_benchmark()
{
	let data = [], start = Date.now(), N = 2 ** 7;

	while (N <= 2 ** 10)
	{
		data.push({
			x: N,
			DFT: benchmark(() => DFT(new Array(N).fill(0))),
			FFTtime: benchmark(() => FFTtime(new Array(N).fill(0))),
			FFTfreq: benchmark(() => FFTfreq(new Array(N).fill(0))),
			FFTlib: benchmark(() => FFTlib(new Array(N).fill(0))),
			Goertzel: benchmark(() => Goertzel(new Array(N).fill(0)))
		});

		N <<= 1;
	}

	while (N <= 2 ** 16)
	{
		data.push({
			x: N,
			FFTtime: benchmark(() => FFTtime(new Array(N).fill(0))),
			FFTfreq: benchmark(() => FFTfreq(new Array(N).fill(0))),
			FFTlib: benchmark(() => FFTlib(new Array(N).fill(0)))
		});

		N <<= 1;
	}

	return (
		<Row>
			<Col xs="12">
				<h1 className="text-center mb-4">Время расчета спектра</h1>
			</Col>
			<LineChart data={data} scale="log" type="basis" ticks={[1e-3, 1e-2, 1e-1, 1]} />
		</Row>
	);
}

function L3_SpectrumSpread(F, N1 = 50)
{
	const Fs = 1000, N = 50;

	const x = new Array(N1).fill(0);
	
	for (let n = 0; n < N; n++)
		x[n] = Math.sin(2 * Math.PI * F / Fs * n);
	
	const X = DFT(x), spectrum = [], signal = [];
	
	for (let i = 0; i < x.length; i++)
		spectrum.push({
			x: i * Fs / N1,
			y: X[i].abs()
		});
	
	for (let i = 0; i < x.length; i++)
		signal.push({
			x: i / Fs,
			y: x[i]
		});

	return (
		<React.Fragment>
			<Row className="mt-5 mb-4">
				<Col xs="12">
					<h1 className="text-center">Растекание спектра, {F} Гц, N = {N1}</h1>
				</Col>
			</Row>
			<Row className="mt-4 mb-5">
				<Col xs="6">
					<h4 className="text-center">Сигнал</h4>
					<hr />
					<LineChart data={signal} />
				</Col>
				<Col xs="6">
					<h4 className="text-center">Спектр</h4>
					<hr />
					<BarChart data={spectrum} />
				</Col>
			</Row>
		</React.Fragment>
	);
}

function L5_FreqAgainstTime()
{
	const Fs = 1000, F = 125, N = 64;

	const x = new Array(N).fill(0);
	
	for (let n = 0; n < N; n++)
		x[n] = Math.sin(2 * Math.PI * F / Fs * n)
	
	const Xtime = FFTtime(x), Xfreq = FFTfreq(x), Atime = [], Afreq = [];
	
	for (let i = 0; i < x.length; i++)
		Atime.push({
			x: i * Fs / N,
			y: Xtime[i].abs()
		});
	
	for (let i = 0; i < x.length; i++)
		Afreq.push({
			x: i * Fs / N,
			y: Xfreq[i].abs()
		});

	return (
		<React.Fragment>
			<Row className="mt-5 mb-4">
				<Col xs="12">
					<h1 className="text-center">Сравнение типов прореживания БПФ, 125 Гц</h1>
				</Col>
			</Row>
			<Row className="mt-4 mb-5">
				<Col xs="6">
					<h4 className="text-center">По времени</h4>
					<hr />
					<BarChart data={Atime} />
				</Col>
				<Col xs="6">
					<h4 className="text-center">По частоте</h4>
					<hr />
					<BarChart data={Afreq} />
				</Col>
			</Row>
		</React.Fragment>
	);
}

function L6_IndividualFrequencies()
{
	const hyp = (x, y) => Math.sqrt(x * x + y * y);

	function getRowForN(N)
	{
		const evalEpsilon = (X04, X10) => hyp(
			X04.abs() * 2 / N - 1.0,
			X10.abs() * 2 / N - 0.5
		);

		const Fs = 1000, f4 = 4 * Fs / N, f10 = 10 * Fs / N;
	
		const x = new Array(N).fill(0);
	
		for (let n = 0; n < N; n++)
			x[n] = Math.sin(2 * Math.PI * f4 / Fs * n) + 0.5 * Math.sin(2 * Math.PI * f10 / Fs * n);
	
		let XGoertzel, XDFT, XFFT;

		const TGoertzel = benchmark(() => XGoertzel = Goertzel(x, 4, 10));
		const TDFT = benchmark(() => XDFT = DFT(x, 4, 10));
		const TFFT = benchmark(() => XFFT = FFTlib(x));

		return (
			<tr key={N}>
				<th scope="row" className="text-right">{N}</th>
				<td>{TGoertzel}</td>
				<td>{evalEpsilon(XGoertzel[0], XGoertzel[1])}</td>
				<td>{TDFT}</td>
				<td>{evalEpsilon(XDFT[0], XDFT[1])}</td>
				<td>{TFFT}</td>
				<td>{evalEpsilon(XFFT[4], XFFT[10])}</td>
			</tr>
		);
	}

	return (
		<React.Fragment>
			<Row className="mt-5 mb-4">
				<Col xs="12">
					<h1 className="text-center">Вычисление отдельных частот</h1>
				</Col>
			</Row>
			<Row className="mt-4 mb-5">
				<Table bordered hover>
					<thead className="text-center">
						<tr>
							<th rowSpan={2}>N</th>
							<th colSpan={2}>Алгоритм Гёрцеля</th>
							<th colSpan={2}>ДПФ</th>
							<th colSpan={2}>БПФ</th>
						</tr>
						<tr>
							<th>t</th>
							<th>&#x03B5;</th>
							<th>t</th>
							<th>&#x03B5;</th>
							<th>t</th>
							<th>&#x03B5;</th>
						</tr>
					</thead>
					<tbody>
						{_.range(5, 19).map(L => getRowForN(2 ** L))}
					</tbody>
				</Table>
			</Row>
		</React.Fragment>
	);
}


const result = (
	<Container className="pt-5 pb-5">
		{/* <h1 className="display-1">L3</h1> */}
		{/* <hr className="mb-5" /> */}
		{L345_benchmark()}
		{L3_SpectrumSpread(200)}
		{L3_SpectrumSpread(210)}
		{L3_SpectrumSpread(210, 200)}
		{L5_FreqAgainstTime()}
		{L6_IndividualFrequencies()}
	</Container>
);

ReactDOM.render(result, document.getElementById('root')); 


// const x = new Array(N).fill(0).map((x, n) => 10 * (n / N) * Math.exp(-n / N * 10));
