require('bootstrap/dist/css/bootstrap.min.css');

const React = require('react');
const ReactDOM = require('react-dom');
const Reactstrap = require('reactstrap');
const Chart = require('./Chart');
const {DFT, FFT} = require('./fourier');

const {
	Container,
	Row,
	Col
} = Reactstrap;


const Fs = 1000, N = 50, F = 200;

const x = new Array(N);

for (let n = 0; n < N; n++)
	x[n] = Math.sin(2 * Math.PI * F / Fs * n)

const X = DFT(x), data = [], signal = [];

for (let i = 0; i < x.length; i++)
	data.push({
		f: (i) * Fs / N,
		a: X[i].abs()
	});

for (let i = 0; i < x.length; i++)
	signal.push({
		f: i / N,
		a: x[i]
	});



const result = (
	<Container fluid>
		<Row>
			<Col xs="6">
				<Chart data={signal} />
			</Col>
			<Col xs="6">
				<Chart data={data} />
			</Col>
		</Row>
	</Container>
);

ReactDOM.render(result, document.getElementById('root')); 

// const x = new Array(N).fill(0).map((x, n) => 10 * (n / N) * Math.exp(-n / N * 10));
