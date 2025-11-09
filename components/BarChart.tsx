
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, Line, Text as SvgText } from 'react-native-svg';

interface BarChartProps {
  data: Array<{ label: string; value: number; color: string }>;
  height?: number;
  maxValue?: number;
  showValues?: boolean;
  currency?: string;
  textColor?: string;
}

export default function BarChart({
  data,
  height = 200,
  maxValue,
  showValues = true,
  currency = 'USD',
  textColor = '#666',
}: BarChartProps) {
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 80;
  const barWidth = Math.min(40, (chartWidth - (data.length - 1) * 12) / data.length);
  const chartHeight = height - 40;

  const max = maxValue || Math.max(...data.map(d => d.value), 1);

  const formatValue = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k`;
    }
    return value.toFixed(0);
  };

  return (
    <View style={styles.container}>
      <Svg width={chartWidth} height={height}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
          const y = chartHeight - ratio * chartHeight + 20;
          return (
            <Line
              key={`grid-${index}`}
              x1="0"
              y1={y}
              x2={chartWidth}
              y2={y}
              stroke="#E0E0E0"
              strokeWidth="1"
              strokeDasharray="4,4"
            />
          );
        })}

        {/* Bars */}
        {data.map((item, index) => {
          const barHeight = (item.value / max) * chartHeight;
          const x = index * (barWidth + 12) + 20;
          const y = chartHeight - barHeight + 20;

          return (
            <React.Fragment key={`bar-${index}`}>
              <Rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={item.color}
                rx={4}
              />
              {showValues && item.value > 0 && (
                <SvgText
                  x={x + barWidth / 2}
                  y={y - 5}
                  fontSize="10"
                  fill={textColor}
                  textAnchor="middle"
                  fontWeight="600"
                >
                  {formatValue(item.value)}
                </SvgText>
              )}
              <SvgText
                x={x + barWidth / 2}
                y={height - 5}
                fontSize="10"
                fill={textColor}
                textAnchor="middle"
              >
                {item.label}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
});
