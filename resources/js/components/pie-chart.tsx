import { PieChart as PieC, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface PieChartData {
    name: string;
    value: number;
}

interface Color {
    scheme: string[];
}

interface PieChartProps {
    data: PieChartData[];
    colors: Color;
}

export function PieChart({data, colors}: PieChartProps) {
  return (
    // Simplemente asegúrate de que ESTE div tenga altura. 
    // Recharts llenará el 100% de width y height.
    <div style={{ width: '100%', height: '350px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieC>
          <Pie
            data={data}
            cx="50%" // Centro X
            cy="50%" // Centro Y
            innerRadius={60} // Para hacerlo tipo "Donut"
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={1}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors.scheme[index % colors.scheme.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="middle" align="right" layout="vertical" />
        </PieC>
      </ResponsiveContainer>
    </div>
  );
}
