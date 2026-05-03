import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createJob, fetchJobStatus } from '../services/api';
import { API_SERVER_URL } from '../Utils/Global';

const steps = [
  { icon: <CloudUploadRoundedIcon color="primary" />, title: 'Upload files', text: 'Choose or drop PDF, image, and document files from your device.' },
  { icon: <TuneRoundedIcon color="primary" />, title: 'Adjust options', text: 'Set page range, quality, sequence, and output settings.' },
  { icon: <DownloadRoundedIcon color="primary" />, title: 'Export result', text: 'Download output or continue editing with another tool.' }
];

const defaultProtectOptions = {
  userPassword: '',
  ownerPassword: '',
  allowPrinting: true,
  allowCopying: false,
  allowModifying: false,
  allowAnnotating: false
};

const defaultSignOptions = {
  signerName: '',
  signatureText: '',
  signatureImageDataUrl: '',
  reason: '',
  location: '',
  pageNumber: 1,
  applyToAllPages: false,
  textColor: '#1f3b73'
};

const defaultWatermarkOptions = {
  watermarkText: 'CONFIDENTIAL',
  textColor: '#c62828',
  fontSize: 42,
  opacity: 0.35,
  pageNumber: 1,
  applyToAllPages: true
};

const defaultEditOptions = {
  overlayText: 'Edited with ImageToPDFNow'
};

export default function UploadWorkbench({ title, toolSlug }) {
  const acceptedFileTypes = toolSlug === 'jpg-to-pdf'
    ? '.jpg,.jpeg,.jfif,.png,image/jpeg,image/png'
    : toolSlug === 'word-to-pdf'
      ? '.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      : toolSlug === 'ppt-to-pdf'
        ? '.ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation'
        : toolSlug === 'excel-to-pdf'
          ? '.xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          : toolSlug === 'pdf-to-jpg' || toolSlug === 'merge-pdf' || toolSlug === 'split-pdf' || toolSlug === 'compress-pdf' || toolSlug === 'protect-pdf' || toolSlug === 'edit-pdf' || toolSlug === 'sign-pdf' || toolSlug === 'watermark-pdf'
            ? '.pdf,application/pdf'
            : '*/*';
  const uploadDescription = toolSlug === 'jpg-to-pdf'
    ? 'Drag and drop JPG or PNG images here, or choose image files to convert into PDF.'
    : toolSlug === 'word-to-pdf'
      ? 'Drag and drop DOC or DOCX files here, or choose Word files to convert into PDF.'
      : toolSlug === 'ppt-to-pdf'
        ? 'Drag and drop PPT or PPTX files here, or choose PowerPoint files to convert into PDF.'
        : toolSlug === 'excel-to-pdf'
          ? 'Drag and drop XLS or XLSX files here, or choose Excel files to convert into PDF.'
          : toolSlug === 'pdf-to-jpg'
            ? 'Drag and drop PDF files here, or choose a PDF to convert into JPG images.'
            : toolSlug === 'merge-pdf'
              ? 'Drag and drop two or more PDF files here to merge them into one document.'
              : toolSlug === 'split-pdf'
                ? 'Drag and drop one PDF file here to split it into separate pages.'
                : toolSlug === 'compress-pdf'
                  ? 'Drag and drop one PDF file here to compress and reduce its size.'
                  : toolSlug === 'protect-pdf'
                    ? 'Drag and drop one PDF file here to protect it with a password and permissions.'
                    : toolSlug === 'edit-pdf'
                      ? 'Drag and drop one PDF file here to add text updates and save the edited copy.'
                      : toolSlug === 'sign-pdf'
                        ? 'Drag and drop one PDF file here to draw or upload your signature and apply it to the document.'
                        : toolSlug === 'watermark-pdf'
                          ? 'Drag and drop one PDF file here to add a text watermark to one page or all pages.'
                          : 'Drag and drop PDF, image, or other files here, or choose files to start.';
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [protectOptions, setProtectOptions] = useState({ ...defaultProtectOptions });
  const [signOptions, setSignOptions] = useState({ ...defaultSignOptions });
  const [watermarkOptions, setWatermarkOptions] = useState({ ...defaultWatermarkOptions });
  const [editOptions, setEditOptions] = useState({ ...defaultEditOptions });
  const [showPasswords, setShowPasswords] = useState({ user: false, owner: false });
  const [editPreviewUrl, setEditPreviewUrl] = useState('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const inputRef = useRef(null);
  const signatureCanvasRef = useRef(null);
  const signatureInputRef = useRef(null);
  const signatureDrawingRef = useRef(false);
  const navigate = useNavigate();
  const pollTimeoutRef = useRef(null);

  const resetUploadState = () => {
    if (pollTimeoutRef.current) {
      clearTimeout(pollTimeoutRef.current);
      pollTimeoutRef.current = null;
    }

    setLoading(false);
    setJob(null);
    setError(null);
    setSelectedFiles([]);
    setProtectOptions({ ...defaultProtectOptions });
    setSignOptions({ ...defaultSignOptions });
    setWatermarkOptions({ ...defaultWatermarkOptions });
    setEditOptions({ ...defaultEditOptions });
    setShowPasswords({ user: false, owner: false });
    if (editPreviewUrl) {
      URL.revokeObjectURL(editPreviewUrl);
    }
    setEditPreviewUrl('');
    setIsEditorOpen(false);

    if (inputRef.current) {
      inputRef.current.value = '';
    }

    if (signatureInputRef.current) {
      signatureInputRef.current.value = '';
    }

    if (toolSlug === 'sign-pdf') {
      const canvas = signatureCanvasRef.current;
      const context = canvas?.getContext('2d');
      if (canvas && context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  useEffect(() => () => {
    if (pollTimeoutRef.current) {
      clearTimeout(pollTimeoutRef.current);
    }
    if (editPreviewUrl) {
      URL.revokeObjectURL(editPreviewUrl);
    }
  }, [editPreviewUrl]);

  useEffect(() => {
    if (toolSlug !== 'sign-pdf') {
      return;
    }

    const canvas = signatureCanvasRef.current;
    const context = canvas?.getContext('2d');

    if (!canvas || !context) {
      return;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = signOptions.textColor || '#1f3b73';
    context.lineWidth = 2.4;
    context.lineCap = 'round';
    context.lineJoin = 'round';
  }, [toolSlug, signOptions.textColor]);

  const updateSelectedFiles = (filesList) => {
    const files = Array.from(filesList || []);
    setSelectedFiles(files);
    setJob(null);
    setError(null);

    if (toolSlug === 'edit-pdf') {
      if (editPreviewUrl) {
        URL.revokeObjectURL(editPreviewUrl);
      }

      if (files[0]) {
        const nextPreviewUrl = URL.createObjectURL(files[0]);
        setEditPreviewUrl(nextPreviewUrl);
        setIsEditorOpen(true);
        navigate('/editor', {
          state: {
            pdfUrl: nextPreviewUrl,
            fileName: files[0].name,
            file: files[0],
            editOptions
          }
        });
      } else {
        setEditPreviewUrl('');
        setIsEditorOpen(false);
      }
    }
  };

  const handleBrowseClick = () => {
    inputRef.current?.click();
  };

  const openSignatureImagePicker = () => {
    signatureInputRef.current?.click();
  };

  const getCanvasPoint = (event) => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) {
      return { x: 0, y: 0 };
    }

    const bounds = canvas.getBoundingClientRect();
    const scaleX = canvas.width / Math.max(bounds.width, 1);
    const scaleY = canvas.height / Math.max(bounds.height, 1);

    return {
      x: (event.clientX - bounds.left) * scaleX,
      y: (event.clientY - bounds.top) * scaleY
    };
  };

  const handleSignaturePointerDown = (event) => {
    const canvas = signatureCanvasRef.current;
    const context = canvas?.getContext('2d');

    if (!canvas || !context) {
      return;
    }

    const { x, y } = getCanvasPoint(event);
    signatureDrawingRef.current = true;
    context.beginPath();
    context.moveTo(x, y);
    setError(null);
  };

  const handleSignaturePointerMove = (event) => {
    if (!signatureDrawingRef.current) {
      return;
    }

    const canvas = signatureCanvasRef.current;
    const context = canvas?.getContext('2d');

    if (!canvas || !context) {
      return;
    }

    const { x, y } = getCanvasPoint(event);
    context.lineTo(x, y);
    context.stroke();
  };

  const handleSignaturePointerUp = () => {
    if (!signatureDrawingRef.current) {
      return;
    }

    signatureDrawingRef.current = false;
    const canvas = signatureCanvasRef.current;

    if (canvas) {
      updateSignOption('signatureImageDataUrl', canvas.toDataURL('image/png'));
      updateSignOption('signatureText', '');
    }
  };

  const clearSignaturePad = () => {
    const canvas = signatureCanvasRef.current;
    const context = canvas?.getContext('2d');

    if (canvas && context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.strokeStyle = signOptions.textColor || '#1f3b73';
      context.lineWidth = 2.4;
      context.lineCap = 'round';
      context.lineJoin = 'round';
    }

    if (signatureInputRef.current) {
      signatureInputRef.current.value = '';
    }

    setSignOptions((previous) => ({
      ...previous,
      signatureText: '',
      signatureImageDataUrl: ''
    }));
  };

  const handleSignatureImageChange = (event) => {
    const imageFile = event.target.files?.[0];

    if (!imageFile) {
      return;
    }

    if (!imageFile.type.startsWith('image/')) {
      setError('Please choose a JPG or PNG image for the signature.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setSignOptions((previous) => ({
          ...previous,
          signatureText: '',
          signatureImageDataUrl: reader.result
        }));
        setError(null);
      }
    };
    reader.readAsDataURL(imageFile);
  };

  const updateProtectOption = (field, value) => {
    setProtectOptions((previous) => ({
      ...previous,
      [field]: value
    }));
  };

  const updateSignOption = (field, value) => {
    setSignOptions((previous) => ({
      ...previous,
      [field]: value
    }));
  };

  const updateWatermarkOption = (field, value) => {
    setWatermarkOptions((previous) => ({
      ...previous,
      [field]: value
    }));
  };

  const updateEditOption = (field, value) => {
    setEditOptions((previous) => ({
      ...previous,
      [field]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((previous) => ({
      ...previous,
      [field]: !previous[field]
    }));
  };

  const handleFileChange = (event) => {
    updateSelectedFiles(event.target.files);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    updateSelectedFiles(event.dataTransfer.files);
  };

  const handleProcess = async () => {
    if (!toolSlug) return;

    if (selectedFiles.length === 0) {
      setError('Please choose at least one PDF, image, or document file first.');
      return;
    }

    if (toolSlug === 'jpg-to-pdf') {
      const hasInvalidFile = selectedFiles.some((file) => {
        const lowerName = file.name.toLowerCase();
        const hasSupportedExtension =
          lowerName.endsWith('.jpg') ||
          lowerName.endsWith('.jpeg') ||
          lowerName.endsWith('.jfif') ||
          lowerName.endsWith('.png');
        const hasSupportedMime =
          file.type === 'image/jpeg' ||
          file.type === 'image/jpg' ||
          file.type === 'image/pjpeg' ||
          file.type === 'image/png' ||
          file.type === 'image/jfif';

        // Some browsers provide empty or generic MIME for local files,
        // so extension check is used as a reliable fallback.
        return !(hasSupportedExtension || hasSupportedMime);
      });

      if (hasInvalidFile) {
        setError('For JPG to PDF, please upload only JPG, JPEG, JFIF, or PNG image files.');
        return;
      }
    }

    if (toolSlug === 'word-to-pdf') {
      const hasInvalidFile = selectedFiles.some((file) => {
        const lowerName = file.name.toLowerCase();
        return !(lowerName.endsWith('.doc') || lowerName.endsWith('.docx'));
      });

      if (hasInvalidFile) {
        setError('For Word to PDF, please upload only DOC or DOCX files.');
        return;
      }
    }

    if (toolSlug === 'ppt-to-pdf') {
      const hasInvalidFile = selectedFiles.some((file) => {
        const lowerName = file.name.toLowerCase();
        return !(lowerName.endsWith('.ppt') || lowerName.endsWith('.pptx'));
      });

      if (hasInvalidFile) {
        setError('For PowerPoint to PDF, please upload only PPT or PPTX files.');
        return;
      }
    }

    if (toolSlug === 'excel-to-pdf') {
      const hasInvalidFile = selectedFiles.some((file) => {
        const lowerName = file.name.toLowerCase();
        return !(lowerName.endsWith('.xls') || lowerName.endsWith('.xlsx'));
      });

      if (hasInvalidFile) {
        setError('For Excel to PDF, please upload only XLS or XLSX files.');
        return;
      }
    }

    if (toolSlug === 'pdf-to-jpg') {
      const hasInvalidFile = selectedFiles.some((file) => {
        const lowerName = file.name.toLowerCase();
        return !lowerName.endsWith('.pdf');
      });

      if (hasInvalidFile) {
        setError('For PDF to JPG, please upload only PDF files.');
        return;
      }
    }

    if (toolSlug === 'merge-pdf') {
      if (selectedFiles.length < 2) {
        setError('Please choose at least two PDF files to merge.');
        return;
      }

      const hasInvalidFile = selectedFiles.some((file) => {
        const lowerName = file.name.toLowerCase();
        return !lowerName.endsWith('.pdf');
      });

      if (hasInvalidFile) {
        setError('For Merge PDF, please upload only PDF files.');
        return;
      }
    }

    if (toolSlug === 'split-pdf') {
      if (selectedFiles.length !== 1) {
        setError('Please choose exactly one PDF file to split.');
        return;
      }

      const hasInvalidFile = selectedFiles.some((file) => {
        const lowerName = file.name.toLowerCase();
        return !lowerName.endsWith('.pdf');
      });

      if (hasInvalidFile) {
        setError('For Split PDF, please upload only PDF files.');
        return;
      }
    }

    if (toolSlug === 'compress-pdf') {
      if (selectedFiles.length !== 1) {
        setError('Please choose exactly one PDF file to compress.');
        return;
      }

      const hasInvalidFile = selectedFiles.some((file) => {
        const lowerName = file.name.toLowerCase();
        return !lowerName.endsWith('.pdf');
      });

      if (hasInvalidFile) {
        setError('For Compress PDF, please upload only PDF files.');
        return;
      }
    }

    if (toolSlug === 'protect-pdf') {
      if (selectedFiles.length !== 1) {
        setError('Please choose exactly one PDF file to protect.');
        return;
      }

      const hasInvalidFile = selectedFiles.some((file) => {
        const lowerName = file.name.toLowerCase();
        return !lowerName.endsWith('.pdf');
      });

      if (hasInvalidFile) {
        setError('For Protect PDF, please upload only PDF files.');
        return;
      }

      if (!protectOptions.userPassword.trim()) {
        setError('Please enter a password to protect the PDF.');
        return;
      }
    }

    if (toolSlug === 'edit-pdf') {
      if (selectedFiles.length !== 1) {
        setError('Please choose exactly one PDF file to edit.');
        return;
      }

      const hasInvalidFile = selectedFiles.some((file) => {
        const lowerName = file.name.toLowerCase();
        return !lowerName.endsWith('.pdf');
      });

      if (hasInvalidFile) {
        setError('For Edit PDF, please upload only PDF files.');
        return;
      }
    }

    if (toolSlug === 'sign-pdf') {
      if (selectedFiles.length !== 1) {
        setError('Please choose exactly one PDF file to sign.');
        return;
      }

      const hasInvalidFile = selectedFiles.some((file) => {
        const lowerName = file.name.toLowerCase();
        return !lowerName.endsWith('.pdf');
      });

      if (hasInvalidFile) {
        setError('For Sign PDF, please upload only PDF files.');
        return;
      }

      if (!signOptions.signerName.trim()) {
        setError('Please enter the signer name before signing the PDF.');
        return;
      }

      if (!signOptions.signatureImageDataUrl && !signOptions.signatureText.trim()) {
        setError('Please draw or upload a signature before signing the PDF.');
        return;
      }
    }

    if (toolSlug === 'watermark-pdf') {
      if (selectedFiles.length !== 1) {
        setError('Please choose exactly one PDF file to watermark.');
        return;
      }

      const hasInvalidFile = selectedFiles.some((file) => {
        const lowerName = file.name.toLowerCase();
        return !lowerName.endsWith('.pdf');
      });

      if (hasInvalidFile) {
        setError('For Watermark PDF, please upload only PDF files.');
        return;
      }

      if (!watermarkOptions.watermarkText.trim()) {
        setError('Please enter watermark text before processing the PDF.');
        return;
      }
    }

    if (pollTimeoutRef.current) {
      clearTimeout(pollTimeoutRef.current);
      pollTimeoutRef.current = null;
    }

    setLoading(true);
    setError(null);

    try {
      const jobData = await createJob(
        toolSlug,
        selectedFiles,
        toolSlug === 'protect-pdf'
          ? {
              ...protectOptions,
              userPassword: protectOptions.userPassword.trim(),
              ownerPassword: protectOptions.ownerPassword.trim() || protectOptions.userPassword.trim()
            }
          : toolSlug === 'edit-pdf'
            ? {
                ...editOptions,
                overlayText: editOptions.overlayText.trim() || 'Edited with ImageToPDFNow'
              }
            : toolSlug === 'sign-pdf'
              ? {
                  ...signOptions,
                  signerName: signOptions.signerName.trim(),
                  signatureText: signOptions.signatureText.trim() || signOptions.signerName.trim(),
                  signatureImageDataUrl: signOptions.signatureImageDataUrl,
                  reason: signOptions.reason.trim(),
                  location: signOptions.location.trim(),
                  pageNumber: Number(signOptions.pageNumber) || 1,
                  applyToAllPages: Boolean(signOptions.applyToAllPages)
                }
              : toolSlug === 'watermark-pdf'
                ? {
                    ...watermarkOptions,
                    watermarkText: watermarkOptions.watermarkText.trim(),
                    textColor: watermarkOptions.textColor,
                    fontSize: Number(watermarkOptions.fontSize) || 42,
                    opacity: Number(watermarkOptions.opacity) || 0.35,
                    pageNumber: Number(watermarkOptions.pageNumber) || 1,
                    applyToAllPages: Boolean(watermarkOptions.applyToAllPages)
                  }
                : {}
      );
      setJob(jobData);

      const poll = async () => {
        try {
          const status = await fetchJobStatus(jobData.jobId);
          setJob(status);
          if (status.status === 'queued') {
            pollTimeoutRef.current = setTimeout(poll, 1000);
          } else {
            pollTimeoutRef.current = null;
            if (status.status === 'failed') {
              setError(status.result?.message || 'File conversion failed.');
            }
          }
        } catch (err) {
          setError(err.message);
        }
      };

      pollTimeoutRef.current = setTimeout(poll, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ mt: 3 }}>
      <CardContent sx={{ p: { xs: 2.2, md: 3.5 } }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Box
              onDragOver={(event) => event.preventDefault()}
              onDrop={handleDrop}
              sx={{
                border: '2px dashed rgba(15, 118, 110, 0.35)',
                borderRadius: 4,
                p: { xs: 3, md: 4 },
                textAlign: 'center',
                bgcolor: 'rgba(15, 118, 110, 0.04)'
              }}
            >
              <input
                ref={inputRef}
                type="file"
                hidden
                multiple
                accept={acceptedFileTypes}
                onChange={handleFileChange}
              />

              <CloudUploadRoundedIcon sx={{ fontSize: 46, color: 'primary.main' }} />
              <Typography variant="h5" sx={{ mt: 1.5 }}>
                {title}
              </Typography>
              <Typography sx={{ mt: 1, color: 'text.secondary' }}>
                {uploadDescription}
              </Typography>

              {toolSlug === 'edit-pdf' && (
                <Stack spacing={1.2} sx={{ mt: 2.2, textAlign: 'left' }}>
                  <TextField
                    size="small"
                    label="Text to add"
                    value={editOptions.overlayText}
                    onChange={(event) => updateEditOption('overlayText', event.target.value)}
                    helperText="Open the full editor for page, position, color, and whiteout controls."
                  />
                </Stack>
              )}

              {toolSlug === 'sign-pdf' && (
                <Stack spacing={1.2} sx={{ mt: 2.2, textAlign: 'left' }}>
                  <TextField
                    size="small"
                    label="Signer name"
                    value={signOptions.signerName}
                    onChange={(event) => updateSignOption('signerName', event.target.value)}
                  />

                  <input
                    ref={signatureInputRef}
                    type="file"
                    hidden
                    accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                    onChange={handleSignatureImageChange}
                  />

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                    <Button variant="outlined" onClick={openSignatureImagePicker}>
                      Upload Signature Image
                    </Button>
                    <Button variant="text" color="inherit" onClick={clearSignaturePad}>
                      Clear Signature
                    </Button>
                  </Stack>

                  <Box sx={{ border: '1px solid rgba(15, 118, 110, 0.18)', borderRadius: 2, p: 1.2, bgcolor: '#fff' }}>
                    <Typography sx={{ fontWeight: 600, mb: 1 }}>Draw signature</Typography>
                    <Box
                      component="canvas"
                      ref={signatureCanvasRef}
                      width={520}
                      height={140}
                      onPointerDown={handleSignaturePointerDown}
                      onPointerMove={handleSignaturePointerMove}
                      onPointerUp={handleSignaturePointerUp}
                      onPointerLeave={handleSignaturePointerUp}
                      sx={{ width: '100%', height: 140, borderRadius: 1.5, border: '1px dashed rgba(15, 118, 110, 0.28)', cursor: 'crosshair', touchAction: 'none', bgcolor: '#fff' }}
                    />
                  </Box>

                  {signOptions.signatureImageDataUrl && (
                    <Box sx={{ border: '1px solid rgba(15, 118, 110, 0.16)', borderRadius: 2, p: 1.2, bgcolor: '#fff' }}>
                      <Typography sx={{ fontWeight: 600, mb: 1 }}>Signature preview</Typography>
                      <Box component="img" src={signOptions.signatureImageDataUrl} alt="Signature preview" sx={{ display: 'block', maxWidth: '100%', maxHeight: 88, objectFit: 'contain' }} />
                    </Box>
                  )}

                  <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
                    Draw or upload your signature. It will be placed on the signed document instead of typed text.
                  </Typography>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                    <TextField
                      size="small"
                      label="Reason"
                      value={signOptions.reason}
                      onChange={(event) => updateSignOption('reason', event.target.value)}
                      sx={{ flex: 1 }}
                    />
                    <TextField
                      size="small"
                      label="Location"
                      value={signOptions.location}
                      onChange={(event) => updateSignOption('location', event.target.value)}
                      sx={{ flex: 1 }}
                    />
                  </Stack>
                  <FormControlLabel
                    control={<Checkbox checked={signOptions.applyToAllPages} onChange={(event) => updateSignOption('applyToAllPages', event.target.checked)} />}
                    label="Sign all pages"
                  />

                  {!signOptions.applyToAllPages && (
                    <TextField
                      size="small"
                      label="Page number"
                      type="number"
                      value={signOptions.pageNumber}
                      onChange={(event) => updateSignOption('pageNumber', event.target.value)}
                    />
                  )}
                </Stack>
              )}

              {toolSlug === 'watermark-pdf' && (
                <Stack spacing={1.2} sx={{ mt: 2.2, textAlign: 'left' }}>
                  <TextField
                    size="small"
                    label="Watermark text"
                    value={watermarkOptions.watermarkText}
                    onChange={(event) => updateWatermarkOption('watermarkText', event.target.value)}
                  />
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                    <TextField
                      size="small"
                      label="Text color"
                      value={watermarkOptions.textColor}
                      onChange={(event) => updateWatermarkOption('textColor', event.target.value)}
                      sx={{ flex: 1 }}
                    />
                    <TextField
                      size="small"
                      label="Font size"
                      type="number"
                      value={watermarkOptions.fontSize}
                      onChange={(event) => updateWatermarkOption('fontSize', event.target.value)}
                      sx={{ flex: 1 }}
                    />
                  </Stack>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                    <TextField
                      size="small"
                      label="Opacity"
                      type="number"
                      value={watermarkOptions.opacity}
                      onChange={(event) => updateWatermarkOption('opacity', event.target.value)}
                      helperText="Use values like 0.2 to 0.6"
                      sx={{ flex: 1 }}
                    />
                    {!watermarkOptions.applyToAllPages && (
                      <TextField
                        size="small"
                        label="Page number"
                        type="number"
                        value={watermarkOptions.pageNumber}
                        onChange={(event) => updateWatermarkOption('pageNumber', event.target.value)}
                        sx={{ flex: 1 }}
                      />
                    )}
                  </Stack>
                  <FormControlLabel
                    control={<Checkbox checked={watermarkOptions.applyToAllPages} onChange={(event) => updateWatermarkOption('applyToAllPages', event.target.checked)} />}
                    label="Apply watermark to all pages"
                  />
                </Stack>
              )}

              {toolSlug === 'protect-pdf' && (
                <Stack spacing={1.2} sx={{ mt: 2.2, textAlign: 'left' }}>
                  <TextField
                    size="small"
                    type={showPasswords.user ? 'text' : 'password'}
                    label="Open password"
                    value={protectOptions.userPassword}
                    onChange={(event) => updateProtectOption('userPassword', event.target.value)}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton edge="end" onClick={() => togglePasswordVisibility('user')}>
                              {showPasswords.user ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }
                    }}
                  />
                  <TextField
                    size="small"
                    type={showPasswords.owner ? 'text' : 'password'}
                    label="Owner password"
                    value={protectOptions.ownerPassword}
                    onChange={(event) => updateProtectOption('ownerPassword', event.target.value)}
                    helperText="Optional. If empty, the open password will be reused."
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton edge="end" onClick={() => togglePasswordVisibility('owner')}>
                              {showPasswords.owner ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }
                    }}
                  />
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={0.5}>
                    <FormControlLabel
                      control={<Checkbox checked={protectOptions.allowPrinting} onChange={(event) => updateProtectOption('allowPrinting', event.target.checked)} />}
                      label="Allow printing"
                    />
                    <FormControlLabel
                      control={<Checkbox checked={protectOptions.allowCopying} onChange={(event) => updateProtectOption('allowCopying', event.target.checked)} />}
                      label="Allow copying"
                    />
                  </Stack>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={0.5}>
                    <FormControlLabel
                      control={<Checkbox checked={protectOptions.allowModifying} onChange={(event) => updateProtectOption('allowModifying', event.target.checked)} />}
                      label="Allow modifying"
                    />
                    <FormControlLabel
                      control={<Checkbox checked={protectOptions.allowAnnotating} onChange={(event) => updateProtectOption('allowAnnotating', event.target.checked)} />}
                      label="Allow annotations"
                    />
                  </Stack>
                </Stack>
              )}

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="center" sx={{ mt: 2.5 }}>
                
                <Button variant="outlined" size="large" onClick={handleBrowseClick}>
                  Choose Files
                </Button>
                {toolSlug === 'edit-pdf' && selectedFiles.length > 0 && (
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/editor', {
                      state: {
                        pdfUrl: editPreviewUrl,
                        fileName: selectedFiles[0]?.name,
                        file: selectedFiles[0],
                        editOptions
                      }
                    })}
                  >
                    Open PDF Editor
                  </Button>
                )}
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleProcess}
                  disabled={loading || selectedFiles.length === 0}
                >
                  {loading ? 'Uploading...' : 'Upload and Process'}
                </Button>
                <Button
                  variant="text"
                  color="inherit"
                  size="large"
                  onClick={resetUploadState}
                  disabled={!loading && selectedFiles.length === 0 && !job}
                >
                  Cancel
                </Button>
              </Stack>

              <Typography sx={{ mt: 1.5, color: 'text.secondary' }}>
                {selectedFiles.length > 0
                  ? `${selectedFiles.length} file(s) selected: ${selectedFiles.map((file) => file.name).join(', ')}`
                  : 'No files selected yet.'}
              </Typography>

              {toolSlug === 'edit-pdf' && isEditorOpen && editPreviewUrl && (
                <Box sx={{ mt: 2, borderRadius: 2, overflow: 'hidden', border: '1px solid rgba(15, 118, 110, 0.18)', bgcolor: 'background.paper' }}>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    spacing={1}
                    sx={{ px: 1.5, py: 1.2, borderBottom: '1px solid rgba(15, 118, 110, 0.12)' }}
                  >
                    <Typography sx={{ fontWeight: 700 }}>PDF Editor Preview</Typography>
                    <Button component="a" href={editPreviewUrl} target="_blank" rel="noopener noreferrer" size="small">
                      Open Full Screen
                    </Button>
                  </Stack>
                  <Box
                    component="iframe"
                    title="PDF Editor Preview"
                    src={editPreviewUrl}
                    sx={{ width: '100%', height: { xs: 320, md: 460 }, border: 0, bgcolor: '#fff' }}
                  />
                </Box>
              )}

              {job && (
                <Typography sx={{ mt: 1, color: 'text.secondary' }}>
                  Job Status: {job.status}
                  {job.status === 'completed' && job.result && (
                    <a href={`${API_SERVER_URL}${job.result.downloadUrl}`} target="_blank" rel="noopener noreferrer"> Download</a>
                  )}
                </Typography>
              )}
            </Box>
            {error && <Alert severity="error" sx={{ mt: 2 }}>Error: {error}</Alert>}
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Typography variant="h6">How this tool works</Typography>
            <List>
              {steps.map((step) => (
                <ListItem key={step.title} disableGutters>
                  <ListItemIcon>{step.icon}</ListItemIcon>
                  <ListItemText primary={step.title} secondary={step.text} />
                </ListItem>
              ))}
            </List>
            <Divider sx={{ my: 1.6 }} />
            <Stack spacing={1}>
              <Typography sx={{ color: 'text.secondary' }}>Batch support up to 50 files</Typography>
              <Typography sx={{ color: 'text.secondary' }}>Supports encrypted and scanned PDFs</Typography>
              <Typography sx={{ color: 'text.secondary' }}>Queue monitoring for advanced workflows</Typography>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
