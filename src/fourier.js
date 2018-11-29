const Cplx = require('complex.js');
const fft = require('fft.js');

exports.DFT = (x) =>
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

exports.FFT = (x) =>
{
	const f = new fft(x.length), out = f.createComplexArray(), res = new Array(x.length);

	f.transform(out, f.toComplexArray(x));

	for (let i = 0; i < x.length; i++) res[i] = new Cplx(out[2 * i], out[2 * i + 1]);

	return res;
}
