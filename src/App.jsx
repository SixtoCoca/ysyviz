import { useState, useRef, useMemo, useEffect } from 'react';
import { Row, Col, Card, Button, Nav, Tab } from 'react-bootstrap';
import html2canvas from 'html2canvas';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { Toaster, toast } from 'react-hot-toast';
import { useLanguage } from './contexts/LanguageContext';
import LanguageSelector from './components/interface/LanguageSelector';
import useIsMobile from './hooks/useIsMobile';

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
import CalendarHeatmapChart from './components/charts/CalendarHeatmapChart';
import PyramidChart from './components/charts/PyramidChart';

import DataUploader from './components/interface/DataUploader';
import { useChartConfig } from './components/config/hooks/useChartConfig';
import useValidatedData from './components/validate/hooks/useValidatedData';
import { ChartFieldRequirements } from './constants/graph-requirements';

import ConfigWithValidation from './components/interface/ConfigWithValidation';
import ChartPreviewMessage from './components/interface/ChartPreviewMessage';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [type, setType] = useState(null);
  const [data, setData] = useState(null);
  const [cfg, setCfg] = useChartConfig();
  const [issues, setIssues] = useState([]);
  const chartRef = useRef();

  const resetConfiguration = () => {
    setCfg({
      title: '',
      type: '',
      color: '#4682b4',
      field_x: '',
      field_y: '',
      field_r: '',
      field_label: '',
      field_value: '',
      field_category: '',
      field_group: '',
      field_source: '',
      field_target: '',
      field_series: '',
      field_pyramid_left: '',
      field_pyramid_right: '',
      customLegend: '',
      customLegendPosition: '',
      colorMode: 'color',
    });
    setIssues([]);
  };

  const handleTypeChange = (newType) => {
    setType(newType);
    resetConfiguration();
  };

  const handleDataChange = (newData) => {
    setData(newData);
    resetConfiguration();
  };

  const isFilled = v => {
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === 'number') return Number.isFinite(v);
    return v !== undefined && v !== null && String(v).trim() !== '';
  };

  const hasRequiredFields = useMemo(() => {
    if (!type) return false;
    const req = ChartFieldRequirements?.[type]?.required || [];
    if (req.length === 0) return true;
    return req.every(key => {
      if (key === 'dimensions') return isFilled(cfg?.dimensions);

      const fieldKey = key.startsWith('field_') ? key : `field_${key}`;

      if (key === 'value' && ['bar', 'line', 'area', 'scatter', 'bubble'].includes(type)) {
        return isFilled(cfg?.[fieldKey]) || isFilled(cfg?.field_series);
      }

      return isFilled(cfg?.[fieldKey]);
    });
  }, [type, cfg]);

  const enableValidation = Boolean(type && hasRequiredFields);

  const { data: chartData } = useValidatedData(
    enableValidation ? data : null,
    enableValidation ? type : null,
    enableValidation ? setIssues : undefined,
    cfg
  );

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
    waterfall: <WaterfallChart {...chartProps} />,
    calendar: <CalendarHeatmapChart {...chartProps} />,
    pyramid: <PyramidChart {...chartProps} />
  };

  const handleDownloadPNG = async () => {
    if (!chartRef.current) return;
    const canvas = await html2canvas(chartRef.current, { backgroundColor: 'white', scale: 2 });
    const link = document.createElement('a');
    link.download = `${cfg.title || 'chart'}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleDownloadSVG = async () => {
    if (!chartRef.current) return;

    const title = cfg.title || 'Chart';

    try {
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: 'white',
        scale: 2,
        useCORS: true,
        allowTaint: true
      });

      const svgData = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">
          <defs>
            <style>
              .title { font-family: Arial, sans-serif; font-size: 18px; font-weight: bold; fill: #333; }
            </style>
          </defs>
          <text x="50%" y="30" text-anchor="middle" class="title">${title}</text>
          <image href="${canvas.toDataURL()}" width="100%" height="100%" />
        </svg>
      `;

      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);

      const link = document.createElement('a');
      link.download = `${title}.svg`;
      link.href = svgUrl;
      link.click();

      URL.revokeObjectURL(svgUrl);
    } catch (error) {
      console.error('Error generating SVG:', error);
    }
  };

  const hasErrors = Array.isArray(issues) && issues.some(i => i.level === 'error');

  useEffect(() => {
    if (hasErrors && enableValidation && type) {
      toast.error(t('error_rendering_chart'));
    }
  }, [hasErrors, enableValidation, type, t]);

  return (
    <div className='min-vh-100 d-flex flex-column' data-testid="app">
      <header className='logo-header' data-testid="app-header">
        <div className='d-flex justify-content-center align-items-center w-100 position-relative'>
          <img src='./src/assets/logo/icono-app.png' alt='No-Code Graphs Logo' className='img-fluid' width='150' height='auto' data-testid="app-logo" />
          <div className='position-absolute end-0'>
            <LanguageSelector />
          </div>
        </div>
      </header>

      <div className='flex-grow-1 d-flex' data-testid="app-content">
        <Tab.Container defaultActiveKey='upload'>
          <Row className='flex-grow-1 w-100 m-0'>
            <Col md={3} className='sidebar px-0 d-flex flex-column'>
              <Nav variant='tabs' className='flex-column p-3 gap-2 flex-grow-1' data-testid="app-navigation">
                <Nav.Item>
                  <Nav.Link eventKey='upload' className='text-center' data-testid="upload-tab">{t('upload_file')}</Nav.Link>
                </Nav.Item>
                {isMobile && (
                  <Nav.Item>
                    <Nav.Link eventKey='config' className='text-center' data-testid="config-tab">{t('configuration')}</Nav.Link>
                  </Nav.Item>
                )}
                <Nav.Item>
                  <Nav.Link eventKey='preview' className='text-center' data-testid="preview-tab">{t('preview_download')}</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>

            <Col md={10} className='p-4 content'>
              <Tab.Content className='h-100'>
                <Tab.Pane eventKey='upload' className='h-100' data-testid="upload-pane">
                  <Card className='h-100'>
                    <Card.Body>
                      <h4 className='mb-3 text-center' data-testid="upload-title">Upload CSV/XLSX</h4>
                      <DataUploader type={type} setData={handleDataChange} />
                    </Card.Body>
                  </Card>
                </Tab.Pane>

                {isMobile && (
                  <Tab.Pane eventKey='config' className='h-100' data-testid="config-pane">
                    <Card className='h-100'>
                      <Card.Body>
                        <ConfigWithValidation
                          cfg={cfg}
                          setCfg={setCfg}
                          type={type}
                          setType={handleTypeChange}
                          setData={handleDataChange}
                          data={data}
                          enableValidation={enableValidation}
                          issues={issues}
                          onClearIssues={() => setIssues([])}
                        />
                      </Card.Body>
                    </Card>
                  </Tab.Pane>
                )}

                <Tab.Pane eventKey='preview' className='h-100' data-testid="preview-pane">
                  <Card className='h-100 position-relative'>
                    {!isMobile && enableValidation && chartData && !hasErrors && (
                      <div className='position-absolute top-0 end-0 m-2 d-flex gap-2' data-testid="download-buttons">
                        <Button
                          variant='light'
                          className='d-flex align-items-center gap-2 shadow-sm'
                          onClick={handleDownloadPNG}
                          data-testid="download-png-btn"
                        >
                          <FontAwesomeIcon icon={faDownload} />
                          {t('png')}
                        </Button>
                        <Button
                          variant='light'
                          className='d-flex align-items-center gap-2 shadow-sm'
                          onClick={handleDownloadSVG}
                          data-testid="download-svg-btn"
                        >
                          <FontAwesomeIcon icon={faDownload} />
                          {t('svg')}
                        </Button>
                      </div>
                    )}
                    <Card.Body className='h-100'>
                      {isMobile ? (
                        <div ref={chartRef} className='d-flex flex-column justify-content-center align-items-center h-100 chart-container' data-testid="chart-container">
                          <h4 className='mb-4 text-center' data-testid="chart-title">
                            {cfg.title || (type ? t(`${type}_chart`) : t('chart_preview'))}
                          </h4>
                          <div className='w-100 d-flex justify-content-center align-items-center min-h-400'>
                            <ChartPreviewMessage
                              type={type}
                              hasRequiredFields={hasRequiredFields}
                              hasErrors={hasErrors}
                              chartData={chartData}
                            />
                            {!hasErrors && hasRequiredFields && type && chartData && chartComponents[type]}
                          </div>
                          {enableValidation && chartData && !hasErrors && (
                            <div className='mt-4 d-flex justify-content-center gap-2'>
                              <Button
                                variant='light'
                                className='d-flex align-items-center gap-2 shadow-sm'
                                onClick={handleDownloadPNG}
                                data-testid="mobile-download-png-btn"
                              >
                                <FontAwesomeIcon icon={faDownload} />
                                {t('png')}
                              </Button>
                              <Button
                                variant='light'
                                className='d-flex align-items-center gap-2 shadow-sm'
                                onClick={handleDownloadSVG}
                                data-testid="mobile-download-svg-btn"
                              >
                                <FontAwesomeIcon icon={faDownload} />
                                {t('svg')}
                              </Button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <Row className='h-100'>
                          <Col md={4} className='border-end pe-3 d-flex flex-column'>
                            <ConfigWithValidation
                              cfg={cfg}
                              setCfg={setCfg}
                              type={type}
                              setType={handleTypeChange}
                              setData={handleDataChange}
                              data={data}
                              enableValidation={enableValidation}
                              issues={issues}
                              onClearIssues={() => setIssues([])}
                            />
                          </Col>
                          <Col md={8} className='ps-3'>
                            <div ref={chartRef} className='d-flex flex-column justify-content-center align-items-center h-100 chart-container' data-testid="chart-container">
                              <h4 className='mb-4 text-center' data-testid="chart-title">
                                {cfg.title || (type ? t(`${type}_chart`) : t('chart_preview'))}
                              </h4>
                              <div className='w-100 d-flex justify-content-center align-items-center min-h-400'>
                                <ChartPreviewMessage
                                  type={type}
                                  hasRequiredFields={hasRequiredFields}
                                  hasErrors={hasErrors}
                                  chartData={chartData}
                                />
                                {!hasErrors && hasRequiredFields && type && chartData && chartComponents[type]}
                              </div>
                            </div>
                          </Col>
                        </Row>
                      )}
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
