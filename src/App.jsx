import { useState, useRef } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import html2canvas from 'html2canvas';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

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
import { useChartConfig } from './components/config/hooks/useChartConfig';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [type, setType] = useState(null);
  const [data, setData] = useState(null);
  const [cfg, setCfg] = useChartConfig();

  const chartRef = useRef();

  const chartProps = { data, config: cfg };

  const chartComponents = {
    bar: <BarChart {...chartProps} />,
    line: <LineChart {...chartProps} />,
    area: <LineChart {...chartProps} filled />,
    pie: <PieChart {...chartProps} />,
    donut: <PieChart {...chartProps} isDonut />,
    scatter: <ScatterChart {...chartProps} />,
    bubble: <BubbleChart {...chartProps} />,
    heatmap: <HeatmapChart {...chartProps} />,
    sankey: <SankeyChart {...chartProps} />,
    chord: <ChordChart {...chartProps} />
  };

  const handleDownload = async () => {
    if (!chartRef.current) return;
    const canvas = await html2canvas(chartRef.current, {
      backgroundColor: 'white',
      scale: 2
    });
    const link = document.createElement('a');
    link.download = `${cfg.title || 'chart'}.png`;
    link.href = canvas.toDataURL();
    link.click();
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
                  <h4 className="mb-3 text-center">Upload CSV/XLSX & Select Chart</h4>
                  <FileUploader setData={setData} setType={setType} type={type} />
                </Card.Body>
              </Card>

              <AdvancedSettings cfg={cfg} setCfg={setCfg} />
            </Col>

            <Col md={8} className="h-100 p-4">
              <Card className="h-100 position-relative">
                {type && data && (
                  <Button
                    variant="light"
                    className="position-absolute top-0 end-0 m-2 d-flex align-items-center gap-2 shadow-sm"
                    onClick={handleDownload}
                  >
                    <FontAwesomeIcon icon={faDownload} />
                    Download
                  </Button>
                )}
                <Card.Body
                  ref={chartRef}
                  className="d-flex flex-column justify-content-center align-items-center"
                >
                  <h4 className="mb-4 text-center">
                    {cfg.title || (type ? `${type.charAt(0).toUpperCase() + type.slice(1)} Chart` : 'Chart Preview')}
                  </h4>

                  <div
                    style={{ width: '100%', minHeight: '400px' }}
                    className="d-flex justify-content-center align-items-center"
                  >
                    {type && data ? chartComponents[type] : (
                      <p className="text-muted text-center">
                        Please upload a data file and select a chart type to see the visualization.
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
