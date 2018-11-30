const React = require('react');
const {
	ResponsiveContainer,
	LineChart,
	Line,
	Brush,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend
} = require('recharts');
const _ = require('lodash');

module.exports = ({data, scale = 'auto', ticks, type="natural"}) => (
	<ResponsiveContainer width="100%" aspect={2}>
		<LineChart data={data} margin={{top: 5, right: 5, left: 5, bottom: 5}}>
			<CartesianGrid strokeDasharray="1 4" stroke="#000000" />
			<XAxis scale={scale} domain={['auto', 'auto']} dataKey="x" />
			<YAxis scale={scale} domain={['auto', 'auto']} ticks={ticks} />
			<Tooltip/>
			<Brush dataKey="x" height={30} stroke="#000000"/>
			{_(data).chain().first().keys().without('x').map(key => (
				<Line key={key} dataKey={key} stroke="#000000" type={type} />
			)).value()}
		</LineChart>
	</ResponsiveContainer>
);
