import { createClient, Provider } from 'urql';
import SelectMetric from '../../components/SelectMetric';
import Graph from './Graph';
import { serverUrl } from './../constants';
import LastMeasurementCards from './LastMeasurementCards';

const client = createClient({
  url: serverUrl,
});

const Measurements = () => {
  return (
    <Provider value={client}>
      <SelectMetric />
      <Graph />
      <LastMeasurementCards />
    </Provider>
  );
};

export default Measurements;
