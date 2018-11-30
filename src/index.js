require('bootstrap/dist/css/bootstrap.min.css');

const React = require('react');
const ReactDOM = require('react-dom');
const Reactstrap = require('reactstrap');

const BarChart = require('./components/BarChart');
const LineChart = require('./components/LineChart');
const {DFT, FFT, FFTlib} = require('./fourier');

const {
	Container,
	Row,
	Col
} = Reactstrap;


function benchmark(subroutine)
{
	const start = performance.now();

	subroutine();

	return (performance.now() - start) / 1000 || 0.001;
}

function L3_Benchmark()
{
	let data = [], start = Date.now(), N = 2;

	while (Date.now() - start < 2 * 1000)
	{
		data.push({
			x: N,
			DFT: benchmark(() => DFT(new Array(N).fill(0))),
			FFT: benchmark(() => FFT(new Array(N).fill(0))),
			FFTlib: benchmark(() => FFTlib(new Array(N).fill(0)))
		});

		N <<= 1;
	}

	while (Date.now() - start < 4 * 1000)
	{
		data.push({
			x: N,
			FFT: benchmark(() => FFT(new Array(N).fill(0))),
			FFTlib: benchmark(() => FFTlib(new Array(N).fill(0)))
		});

		N <<= 1;
	}

	return (
		<Row>
			<Col xs="12">
				<h1 className="text-center mb-4">Сравнение производительности ДПФ и БПФ</h1>
			</Col>
			<LineChart data={data} scale="log" type="basis" ticks={[1e-3, 1e-2, 1e-1, 1]} />
		</Row>
	);
}

function L3_SpectrumSpread(F, N1 = 64)
{
	const Fs = 1000, N = 64;

	const x = new Array(N1).fill(0);
	
	for (let n = 0; n < N; n++)
		x[n] = Math.sin(2 * Math.PI * F / Fs * n)
	
	const X = FFT(x), spectrum = [], signal = [];
	
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
					<h1 className="text-center">Растекание спектра, {F}Гц, N = {N1}</h1>
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


const result = (
	<Container className="pt-5 pb-5">
		{/* <h1 className="display-1">L3</h1> */}
		{/* <hr className="mb-5" /> */}
		{L3_Benchmark()}
		{L3_SpectrumSpread(200)}
		{L3_SpectrumSpread(210)}
		{L3_SpectrumSpread(210, 200)}
	</Container>
);

ReactDOM.render(result, document.getElementById('root')); 


// const x = new Array(N).fill(0).map((x, n) => 10 * (n / N) * Math.exp(-n / N * 10));
