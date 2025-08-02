import React, { useState, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Close,
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { useQuery } from '@tanstack/react-query';
import { accountsApi, importApi } from '../services/api';
import { Account } from '../types';
import FileUploadZone from '../components/FileUploadZone';
import ColumnMappingStep from '../components/ColumnMappingStep';
import ImportPreview from '../components/ImportPreview';
import ImportResults from '../components/ImportResults';

const steps = ['Upload File', 'Map Columns', 'Preview', 'Import'];

interface ImportData {
  file: File | null;
  fileType: string;
  columns: string[];
  sampleData: any[];
  columnMappings: {
    date: string;
    amount: string;
    description: string;
    payee?: string;
    category?: string;
    transactionType?: string;
  };
  account: Account | null;
  defaultTransactionType: string;
}

const Import: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [importData, setImportData] = useState<ImportData>({
    file: null,
    fileType: '',
    columns: [],
    sampleData: [],
    columnMappings: {
      date: '',
      amount: '',
      description: '',
    },
    account: null,
    defaultTransactionType: 'expense',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResults, setImportResults] = useState<any>(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);

  const { data: accounts } = useQuery({
    queryKey: ['accounts'],
    queryFn: accountsApi.getAll,
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      // Determine file type
      const fileType = file.name.toLowerCase().endsWith('.csv') ? 'csv' : 'excel';
      
      // Get column mapping suggestions
      const formData = new FormData();
      formData.append('file', file);
      
      const mappingData = await importApi.getColumnMapping(formData, fileType);
      
      setImportData(prev => ({
        ...prev,
        file,
        fileType,
        columns: mappingData.columns,
        sampleData: mappingData.sample_data,
        columnMappings: {
          date: mappingData.suggested_mappings.date || '',
          amount: mappingData.suggested_mappings.amount || '',
          description: mappingData.suggested_mappings.description || '',
          payee: mappingData.suggested_mappings.payee || '',
          category: mappingData.suggested_mappings.category || '',
          transactionType: mappingData.suggested_mappings.transaction_type || '',
        },
      }));
      
      setActiveStep(1);
    } catch (error) {
      console.error('Error processing file:', error);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    maxFiles: 1,
  });

  const handleNext = () => {
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setImportData({
      file: null,
      fileType: '',
      columns: [],
      sampleData: [],
      columnMappings: {
        date: '',
        amount: '',
        description: '',
      },
      account: null,
      defaultTransactionType: 'expense',
    });
    setImportResults(null);
  };

  const handleImport = async () => {
    if (!importData.file || !importData.account) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', importData.file);
      formData.append('account_id', importData.account.id.toString());
      formData.append('date_column', importData.columnMappings.date);
      formData.append('amount_column', importData.columnMappings.amount);
      formData.append('description_column', importData.columnMappings.description);
      formData.append('default_transaction_type', importData.defaultTransactionType);
      
      if (importData.columnMappings.payee) {
        formData.append('payee_column', importData.columnMappings.payee);
      }
      if (importData.columnMappings.category) {
        formData.append('category_column', importData.columnMappings.category);
      }
      if (importData.columnMappings.transactionType) {
        formData.append('transaction_type_column', importData.columnMappings.transactionType);
      }

      let results;
      if (importData.fileType === 'csv') {
        results = await importApi.importCsv(formData);
      } else {
        results = await importApi.importExcel(formData);
      }

      setImportResults(results);
      setActiveStep(3);
    } catch (error) {
      console.error('Import error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <FileUploadZone
            getRootProps={getRootProps}
            getInputProps={getInputProps}
            isDragActive={isDragActive}
            isProcessing={isProcessing}
          />
        );
      case 1:
        return (
          <ColumnMappingStep
            columns={importData.columns}
            sampleData={importData.sampleData}
            columnMappings={importData.columnMappings}
            accounts={accounts || []}
            selectedAccount={importData.account}
            defaultTransactionType={importData.defaultTransactionType}
            onMappingChange={(mappings) => 
              setImportData(prev => ({ ...prev, columnMappings: mappings }))
            }
            onAccountChange={(account) => 
              setImportData(prev => ({ ...prev, account }))
            }
            onTransactionTypeChange={(type) => 
              setImportData(prev => ({ ...prev, defaultTransactionType: type }))
            }
          />
        );
      case 2:
        return (
          <ImportPreview
            file={importData.file}
            account={importData.account}
            columnMappings={importData.columnMappings}
            sampleData={importData.sampleData}
            defaultTransactionType={importData.defaultTransactionType}
            onPreviewClick={() => setPreviewDialogOpen(true)}
          />
        );
      case 3:
        return (
          <ImportResults
            results={importResults}
            onStartOver={handleReset}
          />
        );
      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (activeStep) {
      case 0:
        return importData.file !== null;
      case 1:
        return (
          importData.columnMappings.date &&
          importData.columnMappings.amount &&
          importData.columnMappings.description &&
          importData.account
        );
      case 2:
        return true;
      default:
        return false;
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Import Transactions
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ minHeight: 400 }}>
          {getStepContent(activeStep)}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
          <Button
            color="inherit"
            disabled={activeStep === 0 || activeStep === 3}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          {activeStep === steps.length - 1 ? (
            <Button onClick={handleReset} variant="contained">
              Import More Files
            </Button>
          ) : activeStep === 2 ? (
            <Button
              onClick={handleImport}
              variant="contained"
              disabled={!canProceed() || isProcessing}
              startIcon={isProcessing ? <CircularProgress size={20} /> : null}
            >
              {isProcessing ? 'Importing...' : 'Import Transactions'}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              variant="contained"
              disabled={!canProceed()}
            >
              Next
            </Button>
          )}
        </Box>
      </Paper>

      {/* Preview Dialog */}
      <Dialog
        open={previewDialogOpen}
        onClose={() => setPreviewDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Data Preview
          <IconButton
            aria-label="close"
            onClick={() => setPreviewDialogOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {importData.columns.map((column) => (
                    <TableCell key={column}>{column}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {importData.sampleData.slice(0, 10).map((row, index) => (
                  <TableRow key={index}>
                    {importData.columns.map((column) => (
                      <TableCell key={column}>
                        {row[column]?.toString() || '-'}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Import;