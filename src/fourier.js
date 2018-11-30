const Cplx = require('complex.js');
const fft = require('fft.js');

function W(x)
{
	return new Cplx({abs: 1, arg: -2 * Math.PI * x});
}

exports.DFT = (x) =>
{
	const N = x.length, X = new Array(N);

	for (let k = 0; k < N; k++)
	{
		let Xk = new Cplx(0, 0);

		for (let n = 0; n < N; n++)
			Xk = Xk.add(W(n * k / N).mul(x[n]))

		X[k] = Xk;
	}

	return X;
}

exports.FFT = (x) =>
{
	const N = x.length;

	if (N === 2)
		return [new Cplx(x[0] + x[1], 0), new Cplx(x[0] - x[1], 0)];

	const x0 = [], x1 = [];

	for (let i = 0; i < N / 2; i++)
	{
		x0.push(x[2 * i]);
		x1.push(x[2 * i + 1]);
	}

	const X0 = exports.FFT(x0);
	const X1 = exports.FFT(x1);

	const X = [];

	for (let k = 0; k < N / 2; k++)
		X.push(X0[k].add(W(k / N).mul(X1[k])));

	for (let k = 0; k < N / 2; k++)
		X.push(X0[k].sub(W(k / N).mul(X1[k])));

	return X;
};

exports.FFTlib = (x) =>
{
	const f = new fft(x.length), out = f.createComplexArray(), res = new Array(x.length);

	f.transform(out, f.toComplexArray(x));

	for (let i = 0; i < x.length; i++) res[i] = new Cplx(out[2 * i], out[2 * i + 1]);

	return res;
}
