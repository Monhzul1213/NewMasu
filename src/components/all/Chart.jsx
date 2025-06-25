import React from "react";
import { ResponsiveContainer, BarChart as ReBarChart, AreaChart as ReAreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, Area } from "recharts";

export function BarChart(props){
  const { style, className, data, dataKey, xFormatter, tickFormatter, tipFormatter, hasLegend, legendFormatter, bars } = props;

  return (
    <div style={style} className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <ReBarChart
          width={500}
          height={360}
          data={data}
          margin={{ top: 5, right: 15, left: 18, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={dataKey} tickFormatter={xFormatter} tick={{fontSize: 'var(--sub-font-size)'}} />
          <YAxis tickFormatter={tickFormatter} tick={{fontSize: 'var(--sub-font-size)'}} />
          <Tooltip cursor={{fill: 'transparent'}} formatter={tipFormatter} labelFormatter={xFormatter} wrapperStyle={{fontSize: 'var(--sub-font-size)'}} />
          {hasLegend && <Legend formatter={legendFormatter} wrapperStyle={{fontSize: 'var(--sub-font-size)'}} />}
          {bars?.map(item => {
            return (<Bar key={item?.key} maxBarSize={20} dataKey={item?.key} fill={item?.color} />);
          })}
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AreaChart(props){
  const { style, className, data, dataKey, tickFormatter, bars, tipFormatter, legendFormatter, hasLegend, xFormatter } = props;
  
  return (
    <div style={style} className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <ReAreaChart
          width={500}
          height={360}
          data={data}
          margin={{ top: 5, right: 15, left: 18, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={dataKey} tickFormatter={xFormatter} tick={{fontSize: 'var(--sub-font-size)'}} />
          <YAxis tickFormatter={tickFormatter} tick={{fontSize: 'var(--sub-font-size)'}} />
          <Tooltip cursor={{fill: 'transparent'}} formatter={tipFormatter} labelFormatter={xFormatter} wrapperStyle={{fontSize: 'var(--sub-font-size)'}} />
          {hasLegend && <Legend formatter={legendFormatter} wrapperStyle={{fontSize: 'var(--sub-font-size)'}} />}
          {bars?.map(item => {
            return (<Area key={item?.key} dataKey={item?.key} fill={item?.fill} stroke={item?.color} dot={{ fill: item?.color, strokeWidth: 1 }} />);
          })}
        </ReAreaChart>
      </ResponsiveContainer>
    </div>
  );
}