const Cplx = require('complex.js');
const fft = require('fft.js');

function W(x)
{
	return new Cplx({abs: 1, arg: -2 * Math.PI * x});
}

function DFT(x, ...ks)
{
	function Xk(k)
	{
		let Xk = new Cplx(0, 0);

		for (let n = 0; n < N; n++)
			Xk = Xk.add(W(n * k / N).mul(x[n]))

		return Xk;
	}

	const N = x.length, X = [];

	if (ks.length)
		for (let k of ks)
			X.push(Xk(k));
	else
		for (let k = 0; k < x.length; k++)
			X.push(Xk(k));

	return X;
}

function FFTtime(x)
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

	const X0 = FFTtime(x0);
	const X1 = FFTtime(x1);

	const X = [];

	for (let k = 0; k < N / 2; k++)
		X.push(X0[k].add(W(k / N).mul(X1[k])));

	for (let k = 0; k < N / 2; k++)
		X.push(X0[k].sub(W(k / N).mul(X1[k])));

	return X;
}

function FFTfreq(x)
{
	const N = x.length;

	if (N === 2)
		return [
			x[0].add(x[1]),
			x[0].sub(x[1])
		];

	const x0 = [], x1 = [];

	for (let i = 0; i < N / 2; i++)
	{
		x0.push(x[i].add(x[i + N / 2]));
		x1.push(x[i].sub(x[i + N / 2]).mul(W(i / N)));
	}

	const X0 = FFTfreq(x0);
	const X1 = FFTfreq(x1);

	const X = [];

	for (let i = 0; i < N / 2; i++)
		X.push(X0[i], X1[i]);

	return X;
}

function FFTlib(x)
{
	const f = new fft(x.length), out = f.createComplexArray(), res = new Array(x.length);

	f.transform(out, f.toComplexArray(x));

	for (let i = 0; i < x.length; i++) res[i] = new Cplx(out[2 * i], out[2 * i + 1]);

	return res;
}

function Goertzel(x, ...ks)
{
	function X(k)
	{
		let xs = new Cplx(0, 0);

		for (r = 0; r < N; r++)
			xs = W(-k / N).mul(xs.add(x[r]));

		return xs;
	}

	const result = [], N = x.length;

	if (ks.length)
		for (let k of ks)
			result.push(X(k));
	else
		for (let k = 0; k < x.length; k++)
			result.push(X(k));

	return result;
}

module.exports = {
	DFT,
	FFTtime,
	FFTfreq: x => FFTfreq(x.map(xn => new Cplx(xn, 0))),
	FFTlib,
	Goertzel
};
