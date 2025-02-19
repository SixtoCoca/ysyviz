import { Container, Row, Col } from 'react-bootstrap';
import BarChart from './components/BarChart';
import LineChart from './components/LineChart';
import FileUploader from './components/FileUploader';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [barData, setBarData] = useState(null);
  const [lineData, setLineData] = useState(null);

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="text-center">Data Visualization with D3</h1>
        </Col>
      </Row>
      
      <Row className="mb-4">
        <Col>
          <FileUploader 
            onBarDataLoad={setBarData}
            onLineDataLoad={setLineData}
          />
        </Col>
      </Row>

      {barData && (
        <Row className="mb-4">
          <Col>
            <div className="bg-light p-4 rounded">
              <h2 className="text-center mb-3">Bar Chart</h2>
              <BarChart data={barData} />
            </div>
          </Col>
        </Row>
      )}

      {lineData && (
        <Row>
          <Col>
            <div className="bg-light p-4 rounded">
              <h2 className="text-center mb-3">Line Chart</h2>
              <LineChart data={lineData} />
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default App;
