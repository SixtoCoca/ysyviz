import { Container, Row, Col } from 'react-bootstrap';
import BarChart from './components/BarChart';
import LineChart from './components/LineChart';
import PieChart from './components/PieChart';
import ScatterChart from './components/ScatterChart';
import FileUploader from './components/FileUploader';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [type, setType] = useState(null);
  const [data, setData] = useState(null);

  const chartComponents = {
    bar: <BarChart data={data} />,
    line: <LineChart data={data} />,
    pie: <PieChart data={data} />,
    donut: <PieChart data={data} isDonut={true} />,
    scatter: <ScatterChart data={data} />
  };


  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="text-center">Data Visualization with D3</h1>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <FileUploader setData={setData} setType={setType} type={type}
          />
        </Col>
      </Row>

      {type && data && (
        <Row className="mb-4">
          <Col>
            <div className="bg-light p-4 rounded">
              <h2 className="text-center mb-3">{type.charAt(0).toUpperCase() + type.slice(1)} Chart</h2>
              {chartComponents[type]}
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default App;
