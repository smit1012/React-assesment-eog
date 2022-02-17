import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from 'urql';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { actions, measurementSelector, selectedMetricsSelector } from './reducer';
import { formatter, getColor, labelFormatter } from './utils';

const multipleMeasurementsQuery = `
query($metrics: [MeasurementQuery]!) {
  heartBeat,
  getMultipleMeasurements(input: $metrics) {
    metric
    measurements {
      metric
      value
      at
    }
  }
}
`;

const Graph = () => {
  const dispatch = useDispatch();

  const measurementsData = useSelector(measurementSelector);
  const selectedMetrics = useSelector(selectedMetricsSelector);

  const [result] = useQuery({
    requestPolicy: 'cache-and-network',
    query: multipleMeasurementsQuery,
    variables: {
      metrics: selectedMetrics,
    },
    pause: selectedMetrics.length === 0 && measurementsData.length === 0,
  });

  const { data, error } = result;

  useEffect(() => {
    if (error) {
      dispatch(actions.measurementApiErrorReceived({ error: error.message }));
      return;
    }

    if (!data) return;

    dispatch(actions.setHeartBeat(data.heartBeat));
    dispatch(actions.measurementDataRecevied(data.getMultipleMeasurements));
  }, [dispatch, data, error]);

  return (
    <div>
      {measurementsData.length ? (
        <div>
          <ResponsiveContainer width="100%" height={500}>
            <LineChart
              data={measurementsData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid />
              <XAxis dataKey="name" interval="preserveStartEnd" minTickGap={200} tickFormatter={formatter} />
              <YAxis />
              <Tooltip labelFormatter={labelFormatter} />
              {selectedMetrics.map((metric, i) => {
                return (
                  <Line
                    type="monotone"
                    isAnimationActive={false}
                    dot={false}
                    dataKey={metric.metricName}
                    stroke={getColor(metric.metricName)}
                    key={i}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div>
          <p></p>
        </div>
      )}
    </div>
  );
};

export default Graph;