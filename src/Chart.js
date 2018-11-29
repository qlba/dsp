const React = require('react');
const {
	ResponsiveContainer,
	BarChart,
	Bar,
	Brush,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip
} = require('recharts');

module.exports = ({data}) => (
	<BarChart data={data} margin={{top: 5, right: 30, left: 20, bottom: 5}} width={1000} height={500}>
		<CartesianGrid strokeDasharray="1 4" stroke="#000000" />
		<XAxis dataKey="f"/>
		<YAxis />
		<Tooltip/>
		<Brush dataKey="f" height={30} stroke="#000000"/>
		<Bar dataKey="a" fill="#000000" />
	</BarChart>
);
