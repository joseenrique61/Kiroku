import { useState, useRef } from 'react';
import axios from 'axios';

// Componentes UI de Shadcn
import { Button } from '@/components/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Íconos de Lucide React
import { UploadCloud, FileSpreadsheet, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Input } from '@/components/input';

const InventoryUploader = () => {
    const [file, setFile] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [status, setStatus] = useState({ type: null, message: null }); // 'success' | 'error'
    const [errors, setErrors] = useState([]);

    // Referencia para resetear el input file si se quita el archivo
    const fileInputRef = useRef(null);

    const ALLOWED_TYPES = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel"
    ];

    // --- Lógica de Drag & Drop y Selección (Misma lógica, mejor implementación) ---

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            validateAndSetFile(e.target.files[0]);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = () => {
        setDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            validateAndSetFile(e.dataTransfer.files[0]);
        }
    };

    const validateAndSetFile = (selectedFile) => {
        setErrors([]);
        setStatus({ type: null, message: null });

        if (selectedFile && ALLOWED_TYPES.includes(selectedFile.type)) {
            setFile(selectedFile);
        } else {
            setFile(null);
            setErrors(['Formato no válido. Por favor sube un archivo Excel (.xlsx o .xls).']);
        }
    };

    const removeFile = () => {
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        setStatus({ type: null, message: null });
        setErrors([]);

        try {
            const response = await axios.post('/api/inventory/import', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setStatus({ type: 'success', message: response.data.message || 'Inventario importado correctamente.' });
            removeFile();
        } catch (error) {
            console.error(error);
            setStatus({ type: 'error', message: 'Hubo un problema con la importación.' });

            if (error.response && error.response.status === 422) {
                const serverErrors = Object.values(error.response.data.errors).flat();
                setErrors(serverErrors);
            } else {
                setErrors(['Error inesperado de conexión o servidor.']);
            }
        } finally {
            setUploading(false);
        }
    };

    return (
        <Card className="max-w-xl mx-auto mt-10 shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Importar Inventario</CardTitle>
                <CardDescription>
                    Sube tu archivo Excel para procesar masivamente dispositivos y adquisiciones.
                    <br />
                    <a href="/templates/inventory_template.xlsx" download className="text-primary hover:underline font-medium">
                        Descargar plantilla de ejemplo
                    </a>
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Zona de Drop (Estilizada para parecerse a un componente nativo) */}
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`
                        border-2 border-dashed rounded-lg p-10 text-center transition-colors cursor-pointer
                        flex flex-col items-center justify-center gap-2
                        ${dragging ? 'border-primary bg-primary/10' : 'border-muted-foreground/25 hover:bg-muted/50'}
                    `}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <UploadCloud className={`h-12 w-12 ${dragging ? 'text-primary' : 'text-muted-foreground'}`} />
                    <div className="text-sm text-muted-foreground">
                        <span className="font-semibold text-primary">Haz clic para subir</span> o arrastra y suelta
                    </div>
                    <p className="text-xs text-muted-foreground">XLSX, XLS (Máx. 40MB)</p>

                    {/* Input oculto pero funcional */}
                    <Input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept=".xlsx, .xls"
                        onChange={handleFileSelect}
                    />
                </div>

                {/* Previsualización del archivo seleccionado */}
                {file && (
                    <div className="flex items-center justify-between p-3 border rounded-md bg-muted/30">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-full dark:bg-green-900">
                                <FileSpreadsheet className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium truncate max-w-[200px]">{file.name}</span>
                                <span className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</span>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); removeFile(); }}>
                            <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                        </Button>
                    </div>
                )}

                {/* Alertas de Éxito */}
                {status.type === 'success' && (
                    <Alert className="border-green-500 text-green-600 bg-green-50 dark:bg-green-900/20">
                        <CheckCircle className="h-4 w-4" />
                        <AlertTitle>¡Éxito!</AlertTitle>
                        <AlertDescription>{status.message}</AlertDescription>
                    </Alert>
                )}

                {/* Alertas de Error General */}
                {(status.type === 'error' || errors.length > 0) && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error en la importación</AlertTitle>
                        <AlertDescription>
                            {status.message && <p className="mb-2">{status.message}</p>}
                            {errors.length > 0 && (
                                <ul className="list-disc list-inside text-xs space-y-1">
                                    {errors.map((err, idx) => (
                                        <li key={idx}>{err}</li>
                                    ))}
                                </ul>
                            )}
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>

            <CardFooter>
                <Button
                    onClick={handleSubmit}
                    disabled={!file || uploading}
                    className="w-full"
                >
                    {uploading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Procesando archivo...
                        </>
                    ) : (
                        'Importar Inventario'
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
}