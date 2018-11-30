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
	<ResponsiveContainer aspect={2}>
		<BarChart data={data} margin={{top: 5, right: 5, left: 5, bottom: 5}}>
			<CartesianGrid strokeDasharray="1 4" stroke="#000000" />
			<XAxis dataKey="x"/>
			<YAxis />
			<Tooltip/>
			<Brush dataKey="x" height={30} stroke="#000000"/>
			<Bar dataKey="y" fill="#000000" />
		</BarChart>
	</ResponsiveContainer>
);
