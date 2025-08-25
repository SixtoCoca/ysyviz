import { useState, useRef } from 'react';
import { Row, Col, Card, Button, Nav, Tab } from 'react-bootstrap';
import html2canvas from 'html2canvas';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { Toaster } from 'react-hot-toast';

import BarChart from './components/charts/BarChart';
import LineChart from './components/charts/LineChart';
import PieChart from './components/charts/PieChart';
import ScatterChart from './components/charts/ScatterChart';
import BubbleChart from './components/charts/BubbleChart';
import HeatmapChart from './components/charts/HeatChart';
import SankeyChart from './components/charts/SanKeyChart';
import ChordChart from './components/charts/ChordChart';
import ViolinChart from './components/charts/ViolinChart';
import BoxplotChart from './components/charts/BoxplotChart';
import HexbinChart from './components/charts/HexbinChart';
import ParallelCoordinatesChart from './components/charts/ParallelCordinatesCharts';
import TreemapChart from './components/charts/TreemapChart';
import SunburstChart from './components/charts/SunburstChart';
import WaterfallChart from './components/charts/WaterfallChart';

import DataUploader from './components/interface/DataUploader';
import AdvancedSettings from './components/config/AdvancedSettings';
import { useChartConfig } from './components/config/hooks/useChartConfig';
import useValidatedData from './components/validate/hooks/useValidatedData';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => {
  const [type, setType] = useState(null);
  const [data, setData] = useState(null);
  const [cfg, setCfg] = useChartConfig();
  const chartRef = useRef();

  const { data: chartData } = useValidatedData(data, type, cfg?.onValidation, cfg);
  const chartProps = { data: chartData, config: cfg };

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
    chord: <ChordChart {...chartProps} />,
    violin: <ViolinChart {...chartProps} />,
    boxplot: <BoxplotChart {...chartProps} />,
    hexbin: <HexbinChart {...chartProps} />,
    parallel: <ParallelCoordinatesChart {...chartProps} />,
    treemap: <TreemapChart {...chartProps} />,
    sunburst: <SunburstChart {...chartProps} />,
    waterfall: <WaterfallChart {...chartProps} />
  };

  const handleDownload = async () => {
    if (!chartRef.current) return;
    const canvas = await html2canvas(chartRef.current, { backgroundColor: 'white', scale: 2 });
    const link = document.createElement('a');
    link.download = `${cfg.title || 'chart'}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className='min-vh-100 d-flex flex-column'>
      <header className='logo-header'>
        <img src='/icono-app.png' alt='No-Code Graphs Logo' className='img-fluid' width='150' height='auto' />
      </header>

      <div className='flex-grow-1 d-flex'>
        <Tab.Container defaultActiveKey='upload'>
          <Row className='flex-grow-1 w-100 m-0'>
            <Col md={3} className='sidebar px-0 d-flex flex-column'>
              <Nav variant='tabs' className='flex-column p-3 gap-2 flex-grow-1'>
                <Nav.Item>
                  <Nav.Link eventKey='upload' className='text-center'>Upload File</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey='preview' className='text-center'>Preview & Download</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>

            <Col md={10} className='p-4 content'>
              <Tab.Content className='h-100'>
                <Tab.Pane eventKey='upload' className='h-100'>
                  <Card className='h-100'>
                    <Card.Body>
                      <h4 className='mb-3 text-center'>Upload CSV/XLSX</h4>
                      <DataUploader type={type} setData={setData} />
                    </Card.Body>
                  </Card>
                </Tab.Pane>

                <Tab.Pane eventKey='preview' className='h-100'>
                  <Card className='h-100 position-relative'>
                    {type && chartData && (
                      <Button
                        variant='light'
                        className='position-absolute top-0 end-0 m-2 d-flex align-items-center gap-2 shadow-sm'
                        onClick={handleDownload}
                      >
                        <FontAwesomeIcon icon={faDownload} />
                        Download
                      </Button>
                    )}
                    <Card.Body className='h-100'>
                      <Row className='h-100'>
                        <Col md={4} className='border-end pe-3 overflow-auto' style={{ maxHeight: 'calc(100vh - 220px)' }}>
                          <h5 className='mb-3 text-center'>Chart Configuration</h5>
                          <AdvancedSettings
                            cfg={cfg}
                            setCfg={setCfg}
                            type={type}
                            setType={setType}
                            setData={setData}
                            data={data}
                          />
                        </Col>
                        <Col md={8} className='ps-3'>
                          <div ref={chartRef} className='d-flex flex-column justify-content-center align-items-center h-100'>
                            <h4 className='mb-4 text-center'>
                              {cfg.title || (type ? `${type.charAt(0).toUpperCase() + type.slice(1)} Chart` : 'Chart Preview')}
                            </h4>
                            <div className='w-100 d-flex justify-content-center align-items-center min-h-400'>
                              {type && chartData ? chartComponents[type] : (
                                <p className='text-muted text-center'>
                                  Please upload a data file and select a chart type to see the visualization.
                                </p>
                              )}
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </div>

      <Toaster position='top-right' toastOptions={{ duration: 2000 }} />
    </div>
  );
};

export default App;
