import { useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import BarChart from './components/BarChart';
import LineChart from './components/LineChart';
import PieChart from './components/PieChart';
import ScatterChart from './components/ScatterChart';
import FileUploader from './components/FileUploader';
import BubbleChart from './components/BubbleChart';
import HeatmapChart from './components/HeatChart';
import SankeyChart from './components/SanKeyChart';
import ChordChart from './components/ChordChart';
import AdvancedSettings from './components/config/AdvancedSettings';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [type, setType] = useState(null);
  const [data, setData] = useState(null);
  const [options, setOptions] = useState({});

  const chartComponents = {
    bar: <BarChart data={data} options={options} />,
    line: <LineChart data={data} options={options} />,
    pie: <PieChart data={data} options={options} />,
    donut: <PieChart data={data} isDonut={true} options={options} />,
    scatter: <ScatterChart data={data} options={options} />,
    bubble: <BubbleChart data={data} options={options} />,
    heatmap: <HeatmapChart data={data} options={options} />,
    area: <LineChart data={data} filled={true} options={options} />,
    sankey: <SankeyChart data={data} options={options} />,
    chord: <ChordChart data={data} options={options} />
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="py-3">
        <h1 className="text-center fw-bold m-0">No-Code Graphs</h1>
      </header>

      <main className="flex-grow-1">
        <Container fluid className="h-100">
          <Row className="h-100">
            <Col md={4} className="h-100 p-4">
              <Card className="mb-4">
                <Card.Body>
                  <h4 className="mb-3 text-center">Upload CSV & Select Chart</h4>
                  <FileUploader setData={setData} setType={setType} type={type} />
                </Card.Body>
              </Card>

              <AdvancedSettings onChange={setOptions} />
            </Col>

            <Col md={8} className="h-100 p-4">
              <Card className="h-100">
                <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                  <h4 className="mb-4 text-center">
                    {options.title || (type ? `${type.charAt(0).toUpperCase() + type.slice(1)} Chart` : 'Chart Preview')}
                  </h4>
                  <div
                    style={{ width: '100%', minHeight: '400px' }}
                    className="d-flex justify-content-center align-items-center"
                  >
                    {type && data ? chartComponents[type] : (
                      <p className="text-muted text-center">
                        Please upload a CSV file and select a chart type to see the visualization.
                      </p>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </main>
    </div>
  );
};

export default App;
