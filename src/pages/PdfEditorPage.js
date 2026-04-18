import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import DriveFolderUploadRoundedIcon from '@mui/icons-material/DriveFolderUploadRounded';
import FormatAlignCenterRoundedIcon from '@mui/icons-material/FormatAlignCenterRounded';
import FormatAlignLeftRoundedIcon from '@mui/icons-material/FormatAlignLeftRounded';
import FormatAlignRightRoundedIcon from '@mui/icons-material/FormatAlignRightRounded';
import FormatBoldRoundedIcon from '@mui/icons-material/FormatBoldRounded';
import FormatItalicRoundedIcon from '@mui/icons-material/FormatItalicRounded';
import FormatUnderlinedRoundedIcon from '@mui/icons-material/FormatUnderlinedRounded';
import GestureRoundedIcon from '@mui/icons-material/GestureRounded';
import InsertPhotoRoundedIcon from '@mui/icons-material/InsertPhotoRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import SubjectRoundedIcon from '@mui/icons-material/SubjectRounded';
import TextFieldsRoundedIcon from '@mui/icons-material/TextFieldsRounded';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Paper,
  Slider,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { createJob, fetchJobStatus } from '../services/api';
import { API_SERVER_URL } from '../Utils/Global';

const defaultOptions = {
  findText: '',
  overlayText: 'Edited with PDF Orbit',
  pageNumber: 1,
  positionX: 40,
  positionY: 80,
  fontSize: 18,
  textColor: '#272757',
  drawWhiteBox: true,
  boxWidth: 320,
  boxHeight: 180,
  applyToAllPages: false,
  fontFamily: 'Helvetica',
  textAlign: 'left',
  isBold: true,
  isItalic: false,
  isUnderline: false
};

const toolbarModes = [
  { key: 'annotate', label: 'Annotate', icon: <GestureRoundedIcon /> },
  { key: 'edit', label: 'Edit', icon: <BorderColorRoundedIcon /> },
  { key: 'insert', label: 'Insert', icon: <InsertPhotoRoundedIcon /> },
  { key: 'edit-text', label: 'Edit Text', icon: <TextFieldsRoundedIcon /> },
  { key: 'forms', label: 'Forms', icon: <SubjectRoundedIcon /> }
];

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const wrapTextForOverlay = (text, maxChars = 40) => {
  const lines = [];
  const paragraphs = String(text || '').replace(/\r/g, '').split('\n');

  paragraphs.forEach((paragraph) => {
    const trimmed = paragraph.trim();
    if (!trimmed) {
      lines.push('');
      return;
    }

    let currentLine = '';
    trimmed.split(/\s+/).forEach((word) => {
      const nextLine = currentLine ? `${currentLine} ${word}` : word;
      if (nextLine.length > maxChars) {
        if (currentLine) {
          lines.push(currentLine);
        }
        currentLine = word;
      } else {
        currentLine = nextLine;
      }
    });

    if (currentLine) {
      lines.push(currentLine);
    }
  });

  return lines;
};

const parseHexToRgb = (hex) => {
  const normalized = String(hex || '').trim().replace('#', '');
  const safeHex = normalized.length === 3
    ? normalized.split('').map((character) => `${character}${character}`).join('')
    : normalized;

  if (!/^[0-9a-fA-F]{6}$/.test(safeHex)) {
    return { r: 0.15, g: 0.15, b: 0.34 };
  }

  return {
    r: parseInt(safeHex.slice(0, 2), 16) / 255,
    g: parseInt(safeHex.slice(2, 4), 16) / 255,
    b: parseInt(safeHex.slice(4, 6), 16) / 255
  };
};

const resolveStandardFontName = (standardFonts, family, isBold, isItalic) => {
  if (family === 'TimesRoman') {
    if (isBold && isItalic) return standardFonts.TimesBoldItalic;
    if (isBold) return standardFonts.TimesBold;
    if (isItalic) return standardFonts.TimesItalic;
    return standardFonts.TimesRoman;
  }

  if (family === 'Courier') {
    if (isBold && isItalic) return standardFonts.CourierBoldOblique;
    if (isBold) return standardFonts.CourierBold;
    if (isItalic) return standardFonts.CourierOblique;
    return standardFonts.Courier;
  }

  if (isBold && isItalic) return standardFonts.HelveticaBoldOblique;
  if (isBold) return standardFonts.HelveticaBold;
  if (isItalic) return standardFonts.HelveticaOblique;
  return standardFonts.Helvetica;
};

let pdfJsPromise;

const loadPdfLib = async () => ({ PDFDocument, StandardFonts, rgb });

const loadPdfJs = async () => {
  if (window.pdfjsLib) {
    return window.pdfjsLib;
  }

  if (!pdfJsPromise) {
    pdfJsPromise = new Promise((resolve, reject) => {
      const existingScript = document.querySelector('script[data-pdf-js="true"]');

      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(window.pdfjsLib));
        existingScript.addEventListener('error', () => reject(new Error('Unable to load the PDF preview library.')));
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.min.js';
      script.async = true;
      script.dataset.pdfJs = 'true';
      script.onload = () => {
        if (window.pdfjsLib) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
          resolve(window.pdfjsLib);
        } else {
          reject(new Error('PDF preview library did not initialize.'));
        }
      };
      script.onerror = () => reject(new Error('Unable to load the PDF preview library.'));
      document.body.appendChild(script);
    });
  }

  return pdfJsPromise;
};

export default function PdfEditorPage() {
  const location = useLocation();
  const inputRef = useRef(null);
  const pollTimeoutRef = useRef(null);
  const previewObjectUrlRef = useRef('');
  const canvasRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(location.state?.file || null);
  const [fileName, setFileName] = useState(location.state?.fileName || location.state?.file?.name || 'Selected PDF');
  const [previewUrl, setPreviewUrl] = useState(location.state?.pdfUrl || '');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [zoom, setZoom] = useState(100);
  const [activeMode, setActiveMode] = useState('edit-text');
  const [previewMetrics, setPreviewMetrics] = useState({ pageCount: 1, pdfWidth: 595, pdfHeight: 842 });
  const [canvasPreviewEnabled, setCanvasPreviewEnabled] = useState(false);
  const [options, setOptions] = useState({
    ...defaultOptions,
    ...(location.state?.editOptions || {})
  });

  const currentUrl = previewUrl || downloadUrl;

  useEffect(() => {
    if (!(selectedFile instanceof File)) {
      return undefined;
    }

    if (previewObjectUrlRef.current) {
      URL.revokeObjectURL(previewObjectUrlRef.current);
      previewObjectUrlRef.current = '';
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    previewObjectUrlRef.current = objectUrl;
    setPreviewUrl(objectUrl);
    setFileName(selectedFile.name);

    return undefined;
  }, [selectedFile]);

  useEffect(() => () => {
    if (pollTimeoutRef.current) {
      clearTimeout(pollTimeoutRef.current);
    }

    if (previewObjectUrlRef.current) {
      URL.revokeObjectURL(previewObjectUrlRef.current);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const renderCanvasPreview = async () => {
      if (!currentUrl && !(selectedFile instanceof File)) {
        setCanvasPreviewEnabled(false);
        return;
      }

      try {
        const pdfjsLib = await loadPdfJs();
        const sourceBytes = selectedFile instanceof File
          ? await selectedFile.arrayBuffer()
          : await fetch(currentUrl).then((response) => response.arrayBuffer());

        if (cancelled) {
          return;
        }

        const pdf = await pdfjsLib.getDocument({ data: sourceBytes }).promise;
        const safePageNumber = Math.min(Math.max(1, toNumber(options.pageNumber, 1)), pdf.numPages || 1);

        if (safePageNumber !== toNumber(options.pageNumber, 1)) {
          setOptions((previous) => ({ ...previous, pageNumber: safePageNumber }));
        }

        const page = await pdf.getPage(safePageNumber);
        const viewport = page.getViewport({ scale: 1.1 * (zoom / 100) });
        const baseViewport = page.getViewport({ scale: 1 });
        const canvas = canvasRef.current;

        if (!canvas || cancelled) {
          return;
        }

        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;

        if (cancelled) {
          return;
        }

        setPreviewMetrics({
          pageCount: pdf.numPages || 1,
          pdfWidth: baseViewport.width || 595,
          pdfHeight: baseViewport.height || 842
        });
        setCanvasPreviewEnabled(true);
      } catch {
        if (!cancelled) {
          setCanvasPreviewEnabled(false);
        }
      }
    };

    renderCanvasPreview();

    return () => {
      cancelled = true;
    };
  }, [selectedFile, currentUrl, options.pageNumber, zoom]);

  const updateOption = (field, value) => {
    setOptions((previous) => ({
      ...previous,
      [field]: value
    }));
  };

  const handleChoosePdf = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const nextFile = event.target.files?.[0];
    if (!nextFile) {
      return;
    }

    setSelectedFile(nextFile);
    setDownloadUrl('');
    setJob(null);
    setError('');
  };

  const handleCanvasPlacement = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / Math.max(bounds.width, 1)) * previewMetrics.pdfWidth;
    const y = ((event.clientY - bounds.top) / Math.max(bounds.height, 1)) * previewMetrics.pdfHeight;

    setOptions((previous) => ({
      ...previous,
      positionX: Math.max(16, Math.round(x)),
      positionY: Math.max(16, Math.round(y))
    }));
    setActiveMode('edit-text');
    setError('');
  };

  const handleApplyChanges = async () => {
    if (!(selectedFile instanceof File) && !previewUrl && !downloadUrl) {
      setError('Please choose a PDF file first.');
      return;
    }

    setLoading(true);
    setError('');
    setJob(null);

    const localEditOptions = {
      findText: String(options.findText || '').trim(),
      overlayText: String(options.overlayText || '').trim() || 'Edited with PDF Orbit',
      pageNumber: Math.max(1, toNumber(options.pageNumber, 1)),
      positionX: Math.max(16, toNumber(options.positionX, 40)),
      positionY: Math.max(16, toNumber(options.positionY, 80)),
      fontSize: Math.max(10, toNumber(options.fontSize, 18)),
      textColor: options.textColor || '#272757',
      drawWhiteBox: Boolean(options.drawWhiteBox),
      boxWidth: Math.max(140, toNumber(options.boxWidth, 280)),
      boxHeight: Math.max(36, toNumber(options.boxHeight, 52)),
      applyToAllPages: Boolean(options.applyToAllPages),
      fontFamily: options.fontFamily,
      textAlign: options.textAlign,
      isBold: Boolean(options.isBold),
      isItalic: Boolean(options.isItalic),
      isUnderline: Boolean(options.isUnderline)
    };

    try {
      const PDFLib = await loadPdfLib();
      const { PDFDocument, StandardFonts, rgb } = PDFLib;
      const sourceBytes = selectedFile instanceof File
        ? await selectedFile.arrayBuffer()
        : await fetch(previewUrl || downloadUrl).then((response) => response.arrayBuffer());

      if (localEditOptions.findText) {
        try {
          const pdfjsLib = await loadPdfJs();
          const previewPdf = await pdfjsLib.getDocument({ data: sourceBytes }).promise;
          const safePageNumber = Math.min(Math.max(1, localEditOptions.pageNumber), previewPdf.numPages || 1);
          const previewPage = await previewPdf.getPage(safePageNumber);
          const viewport = previewPage.getViewport({ scale: 1 });
          const textContent = await previewPage.getTextContent();
          const textItems = Array.isArray(textContent.items) ? textContent.items : [];
          const targetNeedle = localEditOptions.findText.toLowerCase();
          const matchedItem = textItems.find((item) => String(item.str || '').toLowerCase().includes(targetNeedle));

          if (matchedItem) {
            const suggestedWidth = Math.max(
              180,
              Math.round((matchedItem.width || (localEditOptions.findText.length * localEditOptions.fontSize * 0.55)) + 28)
            );
            const suggestedHeight = Math.max(
              localEditOptions.boxHeight,
              Math.round(Math.abs(matchedItem.height || localEditOptions.fontSize) + 28)
            );

            localEditOptions.pageNumber = safePageNumber;
            localEditOptions.positionX = Math.max(16, Math.round((matchedItem.transform?.[4] || 16) - 8));
            localEditOptions.positionY = Math.max(16, Math.round(viewport.height - (matchedItem.transform?.[5] || viewport.height) - suggestedHeight + 10));
            localEditOptions.boxWidth = suggestedWidth;
            localEditOptions.boxHeight = suggestedHeight;

            setOptions((previous) => ({
              ...previous,
              pageNumber: localEditOptions.pageNumber,
              positionX: localEditOptions.positionX,
              positionY: localEditOptions.positionY,
              boxWidth: localEditOptions.boxWidth,
              boxHeight: localEditOptions.boxHeight
            }));
          } else {
            setError('The original text was not found automatically. You can still place the red box manually and update the PDF.');
          }
        } catch {
          setError('Auto-find could not read that PDF text, but manual replacement is still available.');
        }
      }

      const pdfDoc = await PDFDocument.load(sourceBytes);
      const fontName = resolveStandardFontName(StandardFonts, localEditOptions.fontFamily, localEditOptions.isBold, localEditOptions.isItalic);
      const font = await pdfDoc.embedFont(fontName);
      const pages = pdfDoc.getPages();

      if (pages.length === 0) {
        throw new Error('This PDF has no editable pages.');
      }

      const targetPages = localEditOptions.applyToAllPages
        ? pages
        : [pages[Math.min(localEditOptions.pageNumber - 1, pages.length - 1)]].filter(Boolean);
      const textColor = parseHexToRgb(localEditOptions.textColor);

      targetPages.forEach((page) => {
        const { width, height } = page.getSize();
        const safeX = Math.min(Math.max(16, localEditOptions.positionX), Math.max(16, width - 40));
        const safeBoxWidth = Math.min(localEditOptions.boxWidth, Math.max(140, width - safeX - 16));
        const safeBoxHeight = Math.min(localEditOptions.boxHeight, Math.max(36, height - 24));
        const safeY = Math.max(16, height - localEditOptions.positionY - safeBoxHeight);
        const maxChars = Math.max(12, Math.floor((safeBoxWidth - 20) / Math.max(localEditOptions.fontSize * 0.52, 1)));
        const maxLines = Math.max(1, Math.floor((safeBoxHeight - 12) / (localEditOptions.fontSize + 4)));
        const lines = wrapTextForOverlay(localEditOptions.overlayText, maxChars).slice(0, maxLines);

        if (localEditOptions.drawWhiteBox) {
          page.drawRectangle({
            x: safeX,
            y: safeY,
            width: safeBoxWidth,
            height: safeBoxHeight,
            color: rgb(1, 1, 1),
            opacity: 0.96,
            borderColor: rgb(0.15, 0.15, 0.34),
            borderWidth: 1
          });
        }

        lines.forEach((line, index) => {
          const lineWidth = font.widthOfTextAtSize(line, localEditOptions.fontSize);
          let textX = safeX + 10;

          if (localEditOptions.textAlign === 'center') {
            textX = safeX + Math.max(10, (safeBoxWidth - lineWidth) / 2);
          } else if (localEditOptions.textAlign === 'right') {
            textX = safeX + Math.max(10, safeBoxWidth - lineWidth - 10);
          }

          const textY = safeY + safeBoxHeight - localEditOptions.fontSize - 8 - (index * (localEditOptions.fontSize + 4));

          page.drawText(line, {
            x: textX,
            y: textY,
            size: localEditOptions.fontSize,
            font,
            color: rgb(textColor.r, textColor.g, textColor.b)
          });

          if (localEditOptions.isUnderline) {
            page.drawLine({
              start: { x: textX, y: textY - 2 },
              end: { x: textX + lineWidth, y: textY - 2 },
              thickness: 1,
              color: rgb(textColor.r, textColor.g, textColor.b)
            });
          }
        });
      });

      const editedBytes = await pdfDoc.save();
      const nextFileName = /-edited\.pdf$/i.test(fileName)
        ? fileName
        : `${fileName.replace(/\.pdf$/i, '') || 'document'}-edited.pdf`;
      const nextFile = new File([editedBytes], nextFileName, { type: 'application/pdf' });

      setSelectedFile(nextFile);
      setDownloadUrl('');
      setJob({
        status: 'completed',
        result: {
          message: 'PDF updated successfully in the editor.'
        }
      });
      return;
    } catch (localEditError) {
      try {
        const jobData = await createJob('edit-pdf', selectedFile instanceof File ? [selectedFile] : [], localEditOptions);
        setJob(jobData);

        const poll = async () => {
          try {
            const status = await fetchJobStatus(jobData.jobId);
            setJob(status);

            if (status.status === 'queued') {
              pollTimeoutRef.current = setTimeout(poll, 1000);
              return;
            }

            pollTimeoutRef.current = null;

            if (status.status === 'failed') {
              setError(status.result?.message || 'PDF editing failed.');
              return;
            }

            const nextDownloadUrl = `${API_SERVER_URL}${status.result.downloadUrl}`;
            setDownloadUrl(nextDownloadUrl);

            try {
              const response = await fetch(nextDownloadUrl);
              if (response.ok) {
                const blob = await response.blob();
                const nextFileName = status.result.downloadName || 'edited-document.pdf';
                const nextFile = new File([blob], nextFileName, { type: 'application/pdf' });
                setSelectedFile(nextFile);
              } else {
                setPreviewUrl(nextDownloadUrl);
              }
            } catch {
              setPreviewUrl(nextDownloadUrl);
            }
          } catch (pollError) {
            setError(pollError.message || 'Failed to fetch updated PDF status.');
          }
        };

        pollTimeoutRef.current = setTimeout(poll, 1000);
      } catch (requestError) {
        setError(requestError.message || localEditError.message || 'Failed to update the PDF.');
      }
    } finally {
      setLoading(false);
    }
  };

  const previewWidth = `${Math.max(70, Math.min(120, zoom))}%`;
  const selectionOverlay = {
    left: `${Math.min(92, Math.max(0, (toNumber(options.positionX, 40) / Math.max(previewMetrics.pdfWidth, 1)) * 100))}%`,
    top: `${Math.min(92, Math.max(0, (toNumber(options.positionY, 80) / Math.max(previewMetrics.pdfHeight, 1)) * 100))}%`,
    width: `${Math.min(96, Math.max(12, (toNumber(options.boxWidth, 280) / Math.max(previewMetrics.pdfWidth, 1)) * 100))}%`,
    height: `${Math.min(96, Math.max(6, (toNumber(options.boxHeight, 52) / Math.max(previewMetrics.pdfHeight, 1)) * 100))}%`
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#eef2f6' }}>
      <Paper elevation={0} square sx={{ borderBottom: '1px solid rgba(15, 23, 42, 0.08)', bgcolor: '#f8fafc' }}>
        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={1} sx={{ px: 2, py: 1.2 }} alignItems={{ xs: 'stretch', lg: 'center' }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap' }}>
            <Button component={RouterLink} to="/tools/edit-pdf" variant="outlined" startIcon={<ArrowBackRoundedIcon />}>
              Back
            </Button>
            {toolbarModes.map((mode) => (
              <Button
                key={mode.key}
                variant={activeMode === mode.key ? 'contained' : 'text'}
                color={activeMode === mode.key ? 'primary' : 'inherit'}
                startIcon={mode.icon}
                onClick={() => setActiveMode(mode.key)}
              >
                {mode.label}
              </Button>
            ))}
          </Stack>

          <Box sx={{ flexGrow: 1 }} />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Button variant="outlined" onClick={handleChoosePdf} startIcon={<DriveFolderUploadRoundedIcon />}>
              Open PDF
            </Button>
            <Button variant="contained" onClick={handleApplyChanges} startIcon={<SaveRoundedIcon />} disabled={loading || (!selectedFile && !currentUrl)}>
              {loading ? 'Updating...' : 'Update PDF'}
            </Button>
            {(downloadUrl || currentUrl) && (
              <Button component="a" href={downloadUrl || currentUrl} target="_blank" rel="noopener noreferrer" variant="outlined" startIcon={<DownloadRoundedIcon />}>
                Download
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>

      <input ref={inputRef} hidden type="file" accept=".pdf,application/pdf" onChange={handleFileChange} />

      <Box sx={{ p: 2 }}>
        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2} alignItems="stretch">
          <Paper sx={{ width: { xs: '100%', lg: 240 }, p: 2, borderRadius: 3 }}>
            <Stack spacing={2}>
              <Box>
                <Typography variant="h6">Pages</Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: '0.92rem' }}>
                  {fileName}
                </Typography>
              </Box>

              <Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                  <Typography sx={{ fontWeight: 600 }}>Zoom</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{zoom}%</Typography>
                </Stack>
                <Slider min={70} max={120} step={5} value={zoom} onChange={(_, value) => setZoom(value)} />
              </Box>

              <Card variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent sx={{ p: 1.2 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.92rem', mb: 1 }}>
                    Page {options.pageNumber} / {previewMetrics.pageCount}
                  </Typography>
                  <Box sx={{ position: 'relative' }}>
                    {currentUrl ? (
                      <Box
                        component="iframe"
                        title="PDF thumbnail"
                        src={currentUrl}
                        sx={{ width: '100%', height: 220, border: 0, borderRadius: 1.5, bgcolor: '#fff' }}
                      />
                    ) : (
                      <Box sx={{ height: 220, borderRadius: 1.5, display: 'grid', placeItems: 'center', bgcolor: 'rgba(15, 118, 110, 0.05)' }}>
                        <Typography sx={{ color: 'text.secondary', textAlign: 'center' }}>Choose a PDF to preview it here.</Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Stack>
          </Paper>

          <Paper sx={{ flex: 1, borderRadius: 3, overflow: 'hidden' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2, py: 1.2, bgcolor: '#f8fafc', borderBottom: '1px solid rgba(15, 23, 42, 0.08)' }}>
              <Box>
                <Typography sx={{ fontWeight: 700 }}>PDF Editor Workspace</Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: '0.92rem' }}>
                  Mode: {toolbarModes.find((mode) => mode.key === activeMode)?.label || 'Edit Text'}
                </Typography>
              </Box>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.92rem' }}>
                Page {options.pageNumber}
              </Typography>
            </Stack>

            {!currentUrl ? (
              <Box sx={{ minHeight: '76vh', display: 'grid', placeItems: 'center', p: 3 }}>
                <Stack spacing={1.5} alignItems="center">
                  <Typography variant="h5">Open a PDF to start editing</Typography>
                  <Typography sx={{ color: 'text.secondary', textAlign: 'center', maxWidth: 520 }}>
                    This screen now opens as a full editor with tool panels like the layout you shared.
                  </Typography>
                  <Button variant="contained" onClick={handleChoosePdf} startIcon={<DriveFolderUploadRoundedIcon />}>
                    Choose PDF
                  </Button>
                </Stack>
              </Box>
            ) : (
              <Box sx={{ minHeight: '76vh', p: 3, bgcolor: '#dde3ea', overflow: 'auto' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Paper elevation={4} sx={{ width: previewWidth, maxWidth: 980, minWidth: { xs: 260, md: 540 }, bgcolor: '#fff', overflow: 'hidden', transition: 'width 0.2s ease' }}>
                    {canvasPreviewEnabled ? (
                      <Box sx={{ position: 'relative', p: 2, bgcolor: '#fff' }}>
                        <Box
                          component="canvas"
                          ref={canvasRef}
                          onClick={handleCanvasPlacement}
                          sx={{ width: '100%', height: 'auto', display: 'block', cursor: 'crosshair' }}
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            border: '3px solid #ef4444',
                            bgcolor: 'rgba(255, 255, 255, 0.15)',
                            pointerEvents: 'none',
                            ...selectionOverlay
                          }}
                        />
                      </Box>
                    ) : (
                      <Box
                        component="iframe"
                        title="Full Page PDF Editor"
                        src={currentUrl}
                        sx={{ width: '100%', height: '76vh', border: 0, bgcolor: '#fff' }}
                      />
                    )}
                  </Paper>
                </Box>
              </Box>
            )}
          </Paper>

          <Paper sx={{ width: { xs: '100%', lg: 340 }, p: 2, borderRadius: 3 }}>
            <Stack spacing={1.6}>
              <Typography variant="h6">Text Styles</Typography>

              <TextField
                label="Existing text to find"
                value={options.findText}
                onChange={(event) => updateOption('findText', event.target.value)}
                helperText="Optional. Enter old text like a name, date, or company to auto-place the replacement box."
              />

              <TextField
                label="Replacement text"
                multiline
                minRows={6}
                value={options.overlayText}
                onChange={(event) => updateOption('overlayText', event.target.value)}
                helperText="This text will replace the content inside the red box."
              />

              <Stack direction="row" spacing={1}>
                <TextField
                  select
                  label="Font"
                  value={options.fontFamily}
                  onChange={(event) => updateOption('fontFamily', event.target.value)}
                  sx={{ flex: 1 }}
                >
                  <MenuItem value="Helvetica">Helvetica</MenuItem>
                  <MenuItem value="TimesRoman">Times</MenuItem>
                  <MenuItem value="Courier">Courier</MenuItem>
                </TextField>
                <TextField
                  label="Size"
                  type="number"
                  value={options.fontSize}
                  onChange={(event) => updateOption('fontSize', event.target.value)}
                  sx={{ width: 96 }}
                />
              </Stack>

              <ToggleButtonGroup fullWidth exclusive value={options.textAlign} onChange={(_, value) => value && updateOption('textAlign', value)}>
                <ToggleButton value="left">
                  <FormatAlignLeftRoundedIcon />
                </ToggleButton>
                <ToggleButton value="center">
                  <FormatAlignCenterRoundedIcon />
                </ToggleButton>
                <ToggleButton value="right">
                  <FormatAlignRightRoundedIcon />
                </ToggleButton>
              </ToggleButtonGroup>

              <ToggleButtonGroup fullWidth value={[
                ...(options.isBold ? ['bold'] : []),
                ...(options.isItalic ? ['italic'] : []),
                ...(options.isUnderline ? ['underline'] : [])
              ]} onChange={(_, values) => {
                updateOption('isBold', values.includes('bold'));
                updateOption('isItalic', values.includes('italic'));
                updateOption('isUnderline', values.includes('underline'));
              }}>
                <ToggleButton value="bold">
                  <FormatBoldRoundedIcon />
                </ToggleButton>
                <ToggleButton value="italic">
                  <FormatItalicRoundedIcon />
                </ToggleButton>
                <ToggleButton value="underline">
                  <FormatUnderlinedRoundedIcon />
                </ToggleButton>
              </ToggleButtonGroup>

              <TextField
                label="Current Color"
                type="color"
                value={options.textColor}
                onChange={(event) => updateOption('textColor', event.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
              />

              <Stack direction="row" spacing={1}>
                <TextField
                  label="Page"
                  type="number"
                  value={options.pageNumber}
                  onChange={(event) => updateOption('pageNumber', event.target.value)}
                  sx={{ flex: 1 }}
                />
                <TextField
                  label="Left"
                  type="number"
                  value={options.positionX}
                  onChange={(event) => updateOption('positionX', event.target.value)}
                  sx={{ flex: 1 }}
                />
                <TextField
                  label="Top"
                  type="number"
                  value={options.positionY}
                  onChange={(event) => updateOption('positionY', event.target.value)}
                  sx={{ flex: 1 }}
                />
              </Stack>

              <Alert severity="warning">
                Click directly on the PDF page to move the red box onto the text you want to replace.
              </Alert>

              <FormControlLabel
                control={<Checkbox checked={options.drawWhiteBox} onChange={(event) => updateOption('drawWhiteBox', event.target.checked)} />}
                label="White background behind new text"
              />
              <FormControlLabel
                control={<Checkbox checked={options.applyToAllPages} onChange={(event) => updateOption('applyToAllPages', event.target.checked)} />}
                label="Apply to all pages"
              />

              {options.drawWhiteBox && (
                <Stack direction="row" spacing={1}>
                  <TextField
                    label="Box width"
                    type="number"
                    value={options.boxWidth}
                    onChange={(event) => updateOption('boxWidth', event.target.value)}
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    label="Box height"
                    type="number"
                    value={options.boxHeight}
                    onChange={(event) => updateOption('boxHeight', event.target.value)}
                    sx={{ flex: 1 }}
                  />
                </Stack>
              )}

              <Alert severity="info">
                Enter the old text if you want auto-detection, then type the new data and select Update PDF. If needed, move the red box manually.
              </Alert>

              {job && <Alert severity={job.status === 'completed' ? 'success' : 'info'}>Job status: {job.status}</Alert>}
              {error && <Alert severity="error">{error}</Alert>}
            </Stack>
          </Paper>
        </Stack>
      </Box>
    </Box>
  );
}
