const React = require('react');
const ReactDOM = require('react-dom');
const Recharts = require('recharts');
const Cplx = require('complex.js');
const fft = require('fft.js');


const {ResponsiveContainer, BarChart, Bar, Brush, ReferenceLine, XAxis, YAxis, CartesianGrid, Tooltip, Legend} = Recharts;

const SpectrumChart = ({data}) => (
	<ResponsiveContainer width={1000} height={500}>
		<BarChart data={data} margin={{top: 5, right: 30, left: 20, bottom: 5}}>
			<CartesianGrid strokeDasharray="1 3"/>
			<XAxis dataKey="f"/>
			<YAxis />
			<Tooltip/>
			<Brush dataKey="name" height={30} stroke="#8884d8"/>
			<Bar dataKey="amp" fill="#8884d8" scale="log" />
		</BarChart>
	</ResponsiveContainer>
);


function DFT(x)
{
	const N = x.length, X = new Array(N);

	for (let k = 0; k < N; k++)
	{
		let Xk = new Cplx(0, 0);

		for (let n = 0; n < N; n++)
			Xk = Xk.add(new Cplx({arg: -2 * Math.PI * n * k / N, abs: 1}).mul(x[n]))

		X[k] = Xk;
	}

	return X;
}


function FFT(x)
{
	const f = new fft(x.length), out = f.createComplexArray(), res = new Array(x.length);

	f.transform(out, f.toComplexArray(x));

	for (let i = 0; i < x.length; i++) res[i] = new Cplx(out[2 * i], out[2 * i + 1]);

	return res;
}

const Fs = 1000, N = 50;
//const x = new Array(N).fill(0).map((x, n) => Math.sin(2 * Math.PI * 200 / Fs * n));
const x = new Array(N).fill(0).map((x, n) => 10 * (n / N) * Math.exp(-n / N * 10));


const fftx = DFT(x), data = [], signal = [];

for (let i = 0; i < x.length; i++)
	data.push({
		f: (i) * Fs / N,
		amp: fftx[i].abs()
	});

for (let i = 0; i < x.length; i++)
	signal.push({
		f: i / N,
		amp: x[i]
	});


//const data = [
	//{f: 2e1, amp: 0.5},
	//{f: 2e2, amp: 0.25},
	//{f: 2e3, amp: 0.125},
	//{f: 2e4, amp: 0.06125},
//];

const result = (
	<React.Fragment>
		<SpectrumChart data={signal} />
		<SpectrumChart data={data} />
	</React.Fragment>
);

ReactDOM.render(result, document.getElementById('root')); 
