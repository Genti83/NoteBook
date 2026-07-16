import React, { useState, useEffect, useRef } from 'react';
import { getDirectoryHandle, saveDirectoryHandle } from '../lib/directoryFS';
import { Trash2, Minus, Database, Upload, Download, File, FileDown, Plus, X, Maximize2, Save, LogOut, Sun, Moon, FileText, Calendar, Search, Check, Square, ImagePlus, FolderDown, FolderUp, Lock, Unlock, Cloud, LogIn, Loader2, FileSpreadsheet, Sparkles, Mic, MicOff, Palette, Settings, RotateCcw, FileJson, UploadCloud, RefreshCw, Eraser, ImageMinus, Paintbrush, ArrowDownAZ, ArrowUpAZ, CalendarDays, Type, CaseSensitive, RemoveFormatting, Eye, Monitor, Tag, Archive, FolderPlus, Share2, FolderOpen } from 'lucide-react';
import jsPDF from 'jspdf';
import { format } from 'date-fns';

type GridRow = {
  id: string;
  status?: string;
  image?: string;
  [key: string]: any;
};

type GridDocument = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  headers: string[];
  columnWidths?: number[];
  rows: GridRow[];
};

const COLOR_THEMES = {
   blue: { 50: '#eff6ff', 400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8' },
   green: { 50: '#ecfdf5', 400: '#34d399', 500: '#10b981', 600: '#059669', 700: '#047857' },
   purple: { 50: '#faf5ff', 400: '#c084fc', 500: '#a855f7', 600: '#9333ea', 700: '#7e22ce' },
   rose: { 50: '#fff1f2', 400: '#fb7185', 500: '#f43f5e', 600: '#e11d48', 700: '#be123c' },
   indigo: { 50: '#eef2ff', 400: '#818cf8', 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca' },
   kontrast: { 50: '#f4f4f5', 400: '#d4d4d8', 500: '#71717a', 600: '#18181b', 700: '#000000' },
};

export const TAG_COLORS = [
   { id: 'tag-red', color: '#ef4444', name: 'E Kuqe (Red)' },
   { id: 'tag-orange', color: '#f97316', name: 'Portokalli (Orange)' },
   { id: 'tag-amber', color: '#f59e0b', name: 'E Verdhë (Amber)' },
   { id: 'tag-green', color: '#22c55e', name: 'E Gjelbër (Green)' },
   { id: 'tag-emerald', color: '#10b981', name: 'Zmerald (Emerald)' },
   { id: 'tag-teal', color: '#14b8a6', name: 'E Kaltër e Gjelbër (Teal)' },
   { id: 'tag-cyan', color: '#06b6d4', name: 'Sian (Cyan)' },
   { id: 'tag-blue', color: '#3b82f6', name: 'Blu (Blue)' },
   { id: 'tag-indigo', color: '#6366f1', name: 'Indigo (Indigo)' },
   { id: 'tag-violet', color: '#8b5cf6', name: 'Vjollcë (Violet)' },
   { id: 'tag-purple', color: '#a855f7', name: 'Lejla (Purple)' },
   { id: 'tag-pink', color: '#ec4899', name: 'Rozë (Pink)' },
   { id: 'tag-rose', color: '#f43f5e', name: 'Trëndafil (Rose)' },
   { id: 'tag-slate', color: '#64748b', name: 'Gri e Hirtë (Slate)' },
];

const CellInput = React.memo(({
    initialValue,
    onChange,
    readOnly,
    startHold,
    stopHold,
    className,
    style,
}: any) => {
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (inputRef.current && document.activeElement !== inputRef.current) {
            if (inputRef.current.value !== (initialValue || "")) {
                inputRef.current.value = initialValue || "";
            }
        }
    }, [initialValue]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
    };

    return (
        <textarea
            ref={inputRef}
            defaultValue={initialValue || ""}
            onChange={handleChange}
            onFocus={(e) => {
                setTimeout(() => {
                    const el = e.target;
                    const rect = el.getBoundingClientRect();
                    const viewHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
                    if (rect.bottom > viewHeight || rect.top < 0) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 300);
            }}
            placeholder="..."
            readOnly={readOnly}
            onMouseDown={startHold}
            onMouseUp={stopHold}
            onMouseLeave={stopHold}
            onTouchStart={startHold}
            onTouchEnd={stopHold}
            onTouchCancel={stopHold}
            className={className}
            style={style}
            spellCheck={false}
        />
    );
});

const HeaderInput = React.memo(({ initialValue, onChange, className, placeholder }: any) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inputRef.current && document.activeElement !== inputRef.current) {
            if (inputRef.current.value !== (initialValue || "")) {
                inputRef.current.value = initialValue || "";
            }
        }
    }, [initialValue]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    return (
        <input
            ref={inputRef}
            defaultValue={initialValue || ""}
            onChange={handleChange}
            onFocus={(e) => {
                setTimeout(() => {
                    const el = e.target;
                    const rect = el.getBoundingClientRect();
                    const viewHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
                    if (rect.bottom > viewHeight || rect.top < 0) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 300);
            }}
            className={className}
            placeholder={placeholder}
            spellCheck={false}
        />
    );
});

export function Notepad() {
  const [documents, setDocuments] = useState<GridDocument[]>([]);
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(true);
  
  const [viewportHeight, setViewportHeight] = useState('100dvh');

  const [accentColor, setAccentColor] = useState<keyof typeof COLOR_THEMES>('blue');
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  
  const [themeSync, setThemeSync] = useState(() => {
      return localStorage.getItem('grid_theme_sync') === 'true';
  });
  
  const [cloudSyncFrequency, setCloudSyncFrequency] = useState<number>(() => {
      const saved = localStorage.getItem('grid_cloud_sync_freq');
      return saved ? parseInt(saved, 10) : 1500;
  });
  
  const [language, setLanguage] = useState<'sq' | 'en'>(() => (localStorage.getItem('grid_lang') as any) || 'sq');
  const t = (sq: string, en: string) => language === 'en' ? en : sq;
  
  const [downloadMethod, setDownloadMethod] = useState<'auto'|'picker'|'share'|'direct'|'folder'>(() => {
      return (localStorage.getItem('grid_download_method') as 'auto'|'picker'|'share'|'direct'|'folder') || 'auto';
  });
  
  const [folderName, setFolderName] = useState<string>('');
  
  useEffect(() => {
     getDirectoryHandle().then(handle => {
         if (handle) {
             setFolderName(handle.name);
             localStorage.setItem('grid_mock_folder', handle.name);
         } else {
             const mock = localStorage.getItem('grid_mock_folder');
             if (mock) setFolderName(mock);
         }
     });
  }, []);

  const [textSize, setTextSize] = useState<number>(() => {
      const val = parseInt(localStorage.getItem('grid_text_size') || '12', 10);
      return isNaN(val) ? 12 : val;
  });
  const [textWeight, setTextWeight] = useState<number>(() => {
      const saved = localStorage.getItem('grid_text_weight');
      if (saved === 'bold') return 700;
      if (saved === 'normal') return 400;
      const val = parseInt(saved || '400', 10);
      return isNaN(val) ? 400 : val;
  });
  const [textColorMode, setTextColorMode] = useState<string>(() => localStorage.getItem('grid_text_color') || 'default');
  const [showTextMenu, setShowTextMenu] = useState(false);
  const [showTextColorMenu, setShowTextColorMenu] = useState(false);
  const [showTagColorMenu, setShowTagColorMenu] = useState(false);

  const updateTextSize = (val: number) => {
      setTextSize(val);
      localStorage.setItem('grid_text_size', val.toString());
  };
  const updateTextWeight = (val: number) => {
      setTextWeight(val);
      localStorage.setItem('grid_text_weight', val.toString());
  };
  const updateTextColorMode = (val: string) => {
      setTextColorMode(val);
      localStorage.setItem('grid_text_color', val);
  };

  const getActualTextColor = (colorId: string) => {
      if (colorId === 'default') return undefined;
      if (isDark && colorId === '#000000') return '#ffffff';
      if (!isDark && colorId === '#ffffff') return '#000000';
      return colorId;
  };

  const TEXT_COLORS = [
    { id: 'default', color: 'bg-zinc-500', name: t('Standard', 'Standard') },
    { id: '#000000', color: 'bg-black', name: t('E Zezë', 'Black') },
    { id: '#ffffff', color: 'bg-white', name: t('E Bardhë', 'White') },
    { id: '#ff0000', color: 'bg-red-600', name: t('E Kuqe', 'Red') },
    { id: '#0044ff', color: 'bg-blue-600', name: t('Blu', 'Blue') },
    { id: '#00cc44', color: 'bg-green-600', name: t('E Gjelbër', 'Green') },
    { id: '#ffcc00', color: 'bg-yellow-500', name: t('E Verdhë', 'Yellow') },
    { id: '#aa00ff', color: 'bg-purple-600', name: t('Vjollcë', 'Purple') },
    { id: '#ff5500', color: 'bg-orange-600', name: t('Portokalli', 'Orange') },
    { id: '#ff00aa', color: 'bg-pink-600', name: t('Rozë', 'Pink') },
  ];
  
  // Active document state
  const [title, setTitle] = useState(t('Shënim i Paemërtuar', 'Untitled Note'));
  const [rows, setRows] = useState<GridRow[]>([]);
  const [columnWidths, setColumnWidths] = useState<number[]>([]);
  const [headers, setHeaders] = useState([t('Kolona 1', 'Column 1'), t('Kolona 2', 'Column 2'), t('Kolona 3', 'Column 3'), t('Kolona 4', 'Column 4')]);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [showConfirmDeleteSelected, setShowConfirmDeleteSelected] = useState(false);
  
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
     if (activeDocId) {
         const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
         return () => clearInterval(timer);
     }
  }, [activeDocId]);

  const getAlbanianDateTime = () => {
      const d = currentDateTime;
      const dName = [t('E Diel', 'Sun'), t('E Hënë', 'Mon'), t('E Martë', 'Tue'), t('E Mërkurë', 'Wed'), t('E Enjte', 'Thu'), t('E Premte', 'Fri'), t('E Shtunë', 'Sat')][d.getDay()];
      const day = d.getDate().toString().padStart(2, '0');
      const month = [t('Jan', 'Jan'), t('Shk', 'Feb'), t('Mar', 'Mar'), t('Pri', 'Apr'), t('Maj', 'May'), t('Qer', 'Jun'), t('Korr', 'Jul'), t('Gus', 'Aug'), t('Sht', 'Sep'), t('Tet', 'Oct'), t('Nën', 'Nov'), t('Dhj', 'Dec')][d.getMonth()];
      const year = d.getFullYear();
      const time = d.toLocaleTimeString(language === 'en' ? 'en-US' : 'sq-AL', { hour: '2-digit', minute: '2-digit', hour12: false });
      return `${dName} ${day}-${month}-${year} ${time}`;
  };

  const [activeCell, setActiveCell] = useState<{rIndex: number, colKey: string} | null>(null);
  const [modalText, setModalText] = useState('');
  const [previewSelectedRows, setPreviewSelectedRows] = useState(false);
  
  const cellHoldRef = useRef<NodeJS.Timeout | null>(null);

  const handleCellHoldStart = (rIndex: number, colKey: string) => {
      if (cellHoldRef.current) clearTimeout(cellHoldRef.current);
      cellHoldRef.current = setTimeout(() => {
          openModal(rIndex, colKey);
          cellHoldRef.current = null;
      }, 3000); // 3 seconds per user request
  };
  const handleCellHoldCancel = () => {
      if (cellHoldRef.current) {
         clearTimeout(cellHoldRef.current);
         cellHoldRef.current = null;
      }
  };

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const pressTimers = useRef<{ [key: number]: ReturnType<typeof setTimeout> }>({});
  const isLongPress = useRef<{ [key: number]: boolean }>({});
  
  const [toastMessage, setToastMessage] = useState('');
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  
  const [catalogSearch, setCatalogSearch] = useState('');
  const [docSearch, setDocSearch] = useState('');
  const [docToDelete, setDocToDelete] = useState<string | null>(null);
  
  const [user, setUser] = useState<User | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [autoSaveMsg, setAutoSaveMsg] = useState('');
  const autoSaveTimeout = useRef<NodeJS.Timeout | null>(null);
  const localSaveTimeout = useRef<NodeJS.Timeout | null>(null);
  const latestDocsRef = useRef<GridDocument[]>([]);
  const pendingLocalSaveRef = useRef<boolean>(false);

  const [pinModal, setPinModal] = useState<{ isOpen: boolean; action: (() => void) | null; type: 'setup' | 'verify' }>({ isOpen: false, action: null, type: 'verify' });
  const [pinInput, setPinInput] = useState('');
  
  const [appLocked, setAppLocked] = useState(false);
  const [appLockInput, setAppLockInput] = useState('');

  const [authModal, setAuthModal] = useState(false);
  const [email, setEmail] = useState(() => localStorage.getItem('grid_notepad_saved_email') || '');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const [cloudModal, setCloudModal] = useState(false);
  const [backupModal, setBackupModal] = useState(false);
  const [blueModal, setBlueModal] = useState(false);
  const [blueText, setBlueText] = useState('');
  const [cloudDocs, setCloudDocs] = useState<GridDocument[]>([]);
  const [isFetchingCloud, setIsFetchingCloud] = useState(false);

  const [aiChatModal, setAiChatModal] = useState(false);
  const [aiChatInput, setAiChatInput] = useState(() => localStorage.getItem('grid_aichat_input') || '');
  const [aiChatResponse, setAiChatResponse] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [aiChatImage, setAiChatImage] = useState<string | null>(null);
  const [pendingAiChanges, setPendingAiChanges] = useState<{ documentId: string, newHeaders: string[], newColumnWidths?: number[], newRows: GridRow[] } | null>(null);
  const [aiChatAudio, setAiChatAudio] = useState<string | null>(null);
  const [isRecordingMime, setIsRecordingMime] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

  const [listeningCell, setListeningCell] = useState<{rIndex: number, colKey: string} | null>(null);
  const recognitionRef = useRef<any>(null);

  const toggleVoiceRecording = (rIndex: number, colKey: string) => {
     if (listeningCell && listeningCell.rIndex === rIndex && listeningCell.colKey === colKey) {
        // Stop listening
        if (recognitionRef.current) recognitionRef.current.stop();
        setListeningCell(null);
        showToast("Dëgjimi u ndal");
        return;
     }

     if (recognitionRef.current) recognitionRef.current.stop();

     const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
     if (!SpeechRecognition) {
        showToast("Shfletuesi juaj nuk e suporton Voice-to-Text.");
        return;
     }

     const recognition = new SpeechRecognition();
     recognition.lang = 'sq-AL'; // Albanian or auto layout
     recognition.continuous = false;
     recognition.interimResults = false;

     recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        // Removed colMap, dynamic parsing used
        
        let newRows = [...rows];
        const currentVal = newRows[rIndex][colKey as keyof GridRow] as string;
        newRows[rIndex][colKey as keyof GridRow] = (currentVal + (currentVal ? ' ' : '') + transcript).trim();
        setRows(newRows);
        updateActiveDocumentState(title, newRows, headers);
        showToast("Teksti u shtua!");
        setListeningCell(null);
     };

     recognition.onerror = (event: any) => {
        if (event.error !== 'aborted' && event.error !== 'no-speech') {
            console.error("Speech recognition error", event.error);
        }
        if (event.error === 'not-allowed') {
           showToast("Ju lutem lejoni përdorimin e mikrofonit.");
        } else if (event.error !== 'aborted' && event.error !== 'no-speech') {
           showToast("Gabim në dëgjim.");
        }
        setListeningCell(null);
     };

     recognition.onend = () => {
        setListeningCell(null);
     };

     recognitionRef.current = recognition;
     recognition.start();
     setListeningCell({ rIndex, colKey });
     showToast("Po dëgjojmë... Flisni tani.");
  };


  const [listeningModal, setListeningModal] = useState(false);
  const recognitionModalRef = useRef<any>(null);

  const toggleModalVoiceRecording = () => {
     if (listeningModal) {
        if (recognitionModalRef.current) recognitionModalRef.current.stop();
        setListeningModal(false);
        showToast("Dëgjimi u ndal");
        return;
     }

     if (recognitionModalRef.current) recognitionModalRef.current.stop();

     const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
     if (!SpeechRecognition) {
        showToast("Shfletuesi juaj nuk e suporton Voice-to-Text.");
        return;
     }

     const recognition = new SpeechRecognition();
     recognition.lang = 'sq-AL';
     recognition.continuous = false;
     recognition.interimResults = false;

     recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setModalText(prev => (prev + (prev ? ' ' : '') + transcript).trim());
        showToast("Teksti u shtua!");
        setListeningModal(false);
     };

     recognition.onerror = (event: any) => {
        if (event.error !== 'aborted' && event.error !== 'no-speech') {
            console.error("Speech recognition error", event.error);
        }
        if (event.error === 'not-allowed') {
           showToast("Ju lutem lejoni përdorimin e mikrofonit.");
        } else if (event.error !== 'aborted' && event.error !== 'no-speech') {
           showToast("Gabim në dëgjim.");
        }
        setListeningModal(false);
     };

     recognition.onend = () => {
        setListeningModal(false);
     };

     recognitionModalRef.current = recognition;
     recognition.start();
     setListeningModal(true);
     showToast("Po dëgjojmë... Flisni tani.");
  };

  const askAi = async (overridePrompt?: string) => {
    const promptText = typeof overridePrompt === 'string' ? overridePrompt : aiChatInput;
    if (!promptText.trim()) return;
    setIsAiThinking(true);
    setAiChatResponse('');
    try {
       // Dërgo të gjitha dokumentet tek AI për histori dhe analizë të thellë, pa imazhe për të kursyer bandwidth
       const docsForAi = documents.map(docItem => ({
          ...docItem,
          rows: docItem.rows.map(r => {
             const { image, ...rest } = r;
             return rest;
          })
       }));
       
       const response = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: promptText, documents: docsForAi, activeDocId, image: aiChatImage, audio: aiChatAudio })
       });
       if (response.ok) {
          const data = await response.json();
          setAiChatResponse(data.text || "Veprimi krye!");
          
          if (data.actions && Array.isArray(data.actions)) {
             data.actions.forEach((act: any) => {
                if (act.type === 'PROPOSE_COLUMNS_CHANGE' && act.documentId && act.newHeaders && act.newRows) {
                   setPendingAiChanges({
                      documentId: act.documentId,
                      newHeaders: act.newHeaders,
                      newColumnWidths: act.newColumnWidths,
                      newRows: act.newRows
                   });
                } else if (act.type === 'UPDATE_DOCUMENT_ROWS' && act.documentId && act.newRows) {
                   const updatedDocs = documents.map(d => {
                      if (d.id === act.documentId) {
                         // Restore images for updated rows
                         const newRowsWithImages = act.newRows.map((nr: any, idx: number) => {
                            const origRow = d.rows.find(or => or.id === nr.id);
                            return { ...nr, image: origRow?.image || d.rows[idx]?.image || '' };
                         });
                         if (d.id === activeDocId) {
                            setRows(newRowsWithImages);
                         }
                         return { ...d, rows: newRowsWithImages };
                      }
                      return d;
                   });
                   setDocuments(updatedDocs);
                   triggerAutoSave(updatedDocs);
                   showToast("Dokumenti u përditësua nga AI!");
                }
             });
          }
       } else {
          try {
             const errData = await response.json();
             setAiChatResponse(`Gabim: ${errData.error || "Nuk mund të komunikohet me AI."}`);
          } catch(e) {
             setAiChatResponse(`Gabim HTTP: ${response.status} ${response.statusText}`);
          }
       }
    } catch (err) {
       setAiChatResponse("Gabim lidhjeje me serverin.");
    }
    setIsAiThinking(false);
    setAiChatInput('');
    setAiChatImage(null);
    setAiChatAudio(null);
  };


  const startRecordingAiAudio = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];
        mediaRecorder.ondataavailable = e => {
           if(e.data.size > 0) audioChunksRef.current.push(e.data);
        };
        mediaRecorder.onstop = () => {
           const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
           const reader = new FileReader();
           reader.readAsDataURL(blob);
           reader.onloadend = () => {
              setAiChatAudio(reader.result as string);
           };
        };
        mediaRecorder.start();
        setIsRecordingMime(true);
    } catch(err) {
        showToast("Nuk mund të hapet mikrofoni.");
    }
  };

  const stopRecordingAiAudio = () => {
      if(mediaRecorderRef.current && isRecordingMime) {
           mediaRecorderRef.current.stop();
           mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
           setIsRecordingMime(false);
      }
  };

  const handleAiChatImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if(file) {
         const reader = new FileReader();
         reader.onload = ev => setAiChatImage(ev.target?.result as string);
         reader.readAsDataURL(file);
      }
  };

  const fetchCloudDocs = async (uid: string) => {
     setIsFetchingCloud(true);
     try {
        const q = query(collection(db, 'documents'), where('userId', '==', uid));
        const snaps = await getDocs(q);
        const fetched: GridDocument[] = [];
        snaps.forEach(s => {
           const data = s.data();
           if (data) fetched.push(data as GridDocument);
        });
        setCloudDocs(fetched);
     } catch (err) {
        showToast("Gabim gjatë marrjes nga Cloud.");
     }
     setIsFetchingCloud(false);
  };

  const deleteCloudDoc = async (cDoc: any) => {
    if (!confirm(`Jeni i sigurt që doni ta fshini listën "${cDoc.title || 'Pa titull'}" përgjithmonë nga Cloud?`)) return;
    try {
       await deleteDoc(doc(db, 'documents', cDoc.id));
       setCloudDocs(prev => prev.filter(d => d.id !== cDoc.id));
       showToast("Dokumenti u fshi nga Cloud.");
    } catch (e) {
       showToast("Gabim gjatë fshirjes nga Cloud.");
    }
  };

  const openCloudModal = () => {
     executeProtectedAction(() => {
        setCloudModal(true);
        const currentUser = auth.currentUser;
        if (currentUser) {
           fetchCloudDocs(currentUser.uid);
        }
     });
  };

  useEffect(() => {
    const savedPin = localStorage.getItem('grid_notepad_pin');
    if (savedPin) {
       setAppLocked(true);
    }
    const savedOrange = localStorage.getItem('grid_notepad_blue');
    if (savedOrange) {
       setBlueText(savedOrange);
    }

    const unsub = onAuthStateChanged(auth, async (u) => {
       setUser(u);
       if (u) {
           try {
               const q = query(collection(db, 'documents'), where('userId', '==', u.uid));
               const snaps = await getDocs(q);
               const fetched: GridDocument[] = [];
               snaps.forEach(s => {
                  const data = s.data();
                  if (data) fetched.push(data as GridDocument);
               });
               
               setDocuments(prevLocal => {
                   const mergedMap = new Map<string, GridDocument>();
                   prevLocal.forEach(d => mergedMap.set(d.id, d));
                   
                   fetched.forEach(d => {
                       const existing = mergedMap.get(d.id);
                       if (!existing || new Date(d.updatedAt) > new Date(existing.updatedAt)) {
                           mergedMap.set(d.id, d);
                       }
                   });
                   
                   const newMerged = Array.from(mergedMap.values()).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
                   localStorage.setItem('grid_notepad_documents_v2', JSON.stringify(newMerged));
                   
                   // Push any newer local docs to cloud silently
                   newMerged.forEach(async (docObj) => {
                       const cloudVersion = fetched.find(c => c.id === docObj.id);
                       if (!cloudVersion || new Date(docObj.updatedAt) > new Date(cloudVersion.updatedAt)) {
                           try {
                               await setDoc(doc(db, 'documents', docObj.id), { ...docObj, userId: u.uid });
                           } catch (e) { console.error("Auto sync push error", e); }
                       }
                   });
                   
                   return newMerged;
               });
           } catch (err) {
               console.error("Auto sync fetch error", err);
           }
       }
    });
    return () => unsub();
  }, []);

  // Periodic Auto-Backup to LocalStorage
  useEffect(() => {
     const interval = setInterval(() => {
         if (documents.length > 0) {
             localStorage.setItem('grid_notepad_documents_v2_backup_interval', JSON.stringify(documents));
             if (blueText) {
                 localStorage.setItem('grid_notepad_blue_backup_interval', blueText);
             }
             
             setIsSaving(true);
             setAutoSaveMsg(t('Ruajtur lokalisht (Backup)', 'Saved locally (Backup)'));
             
             if (auth.currentUser && navigator.onLine) {
                 documents.forEach(docObj => {
                     setDoc(doc(db, 'documents', docObj.id), { ...docObj, userId: auth.currentUser!.uid }).catch(()=>{});
                 });
             }
             
             setTimeout(() => {
                 setIsSaving(false);
                 setAutoSaveMsg('');
             }, 3000);
         }
     }, 60000); // every 60 seconds
     return () => clearInterval(interval);
  }, [documents, blueText]);



  const handleEmailAuth = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          if (isSignUp) {
              await createUserWithEmailAndPassword(auth, email, password);
              showToast("Llogaria u krijua!");
          } else {
              await signInWithEmailAndPassword(auth, email, password);
              showToast("Hyrje e suksesshme!");
          }
          localStorage.setItem('grid_notepad_saved_email', email);
          setAuthModal(false);
          setPassword('');
          setTimeout(() => forceCloudBackup(), 1500);
      } catch (err: any) {
          let msg = "Gabim gjatë procesit: " + err.message;
          if (err.code === 'auth/email-already-in-use') msg = "Kjo adresë emaili është tashmë në përdorim.";
          if (err.code === 'auth/weak-password') msg = "Fjalëkalimi është tepër i dobët. (Min. 6 karaktere)";
          if (err.code === 'auth/invalid-email') msg = "Formati i emailit është i pasaktë.";
          if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') msg = "Emaili ose fjalëkalimi i gabuar.";
          if (err.code === 'auth/operation-not-allowed') msg = "Hyrja me Email është e çaktivizuar. Kyçuni me Google ose aktivizoni Emailin në Firebase Console.";
          showToast(msg);
      }
  };

  const loginWithGoogle = async () => {
      try {
         const provider = new GoogleAuthProvider();
         await signInWithPopup(auth, provider);
         setAuthModal(false);
         setTimeout(() => forceCloudBackup(), 1500);
      } catch (err: any) {
         if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/operation-not-supported-in-this-environment') {
             showToast("Hyrja me Google u anulua ose bllokua. Nëse jeni në aplikacionin celular (APK), ju lutem përdorni Email dhe Fjalëkalim për t'u kyçur.");
         } else {
             showToast("Gabim gjatë hyrjes me Google: " + err.message);
         }
      }
  };

  const executeProtectedAction = (action: () => void) => {
      const savedPin = localStorage.getItem('grid_notepad_pin');
      if (!savedPin) {
          setPinModal({ isOpen: true, action, type: 'setup' });
      } else {
          setPinModal({ isOpen: true, action, type: 'verify' });
      }
  };

  const handlePinSubmit = () => {
      const savedPin = localStorage.getItem('grid_notepad_pin');
      if (pinModal.type === 'setup') {
         if (pinInput.length < 4) {
             alert('Kodi PIN duhet të jetë të paktën 4 shifra!');
             return;
         }
         localStorage.setItem('grid_notepad_pin', pinInput);
         setPinModal({ isOpen: false, action: null, type: 'verify' });
         setPinInput('');
         if (pinModal.action) pinModal.action();
         showToast('Pin u krijua me sukses!');
      } else {
         if (pinInput === savedPin) {
             setPinModal({ isOpen: false, action: null, type: 'verify' });
             setPinInput('');
             if (pinModal.action) pinModal.action();
         } else {
             alert('PIN i gabuar!');
             setPinInput('');
         }
      }
  };

  const triggerAutoSave = (updatedDocs: GridDocument[]) => {
      latestDocsRef.current = updatedDocs;
      pendingLocalSaveRef.current = true;
      
      if (localSaveTimeout.current) clearTimeout(localSaveTimeout.current);
      localSaveTimeout.current = setTimeout(() => {
          localStorage.setItem('grid_notepad_documents_v2', JSON.stringify(updatedDocs));
          pendingLocalSaveRef.current = false;
      }, 500);

      const freq = parseInt(localStorage.getItem('grid_cloud_sync_freq') || '1500', 10);
      if (freq === -1) return; // Off

      setIsSaving(true);
      setAutoSaveMsg('Po ruan...');
      
      if (autoSaveTimeout.current) clearTimeout(autoSaveTimeout.current);
      autoSaveTimeout.current = setTimeout(async () => {
         const currentUser = auth.currentUser;
         // Auto save (AI/Sync) to cloud if online and logged in
         if (currentUser && activeDocId && navigator.onLine) {
            const currentDoc = updatedDocs.find(d => d.id === activeDocId);
            if (currentDoc) {
               try {
                  const docRef = doc(db, 'documents', currentDoc.id);
                  await setDoc(docRef, { ...currentDoc, userId: currentUser.uid });
               } catch (e) {
                  console.error("Cloud autosave warning", e);
               }
            }
         }
         setIsSaving(false);
         setAutoSaveMsg('Ruajtur (AI)');
         setTimeout(() => setAutoSaveMsg(''), 2000);
      }, freq);
  };

  useEffect(() => {
     latestDocsRef.current = documents;
  }, [documents]);

  useEffect(() => {
    const handleBeforeUnload = () => {
       if (pendingLocalSaveRef.current) {
           localStorage.setItem('grid_notepad_documents_v2', JSON.stringify(latestDocsRef.current));
       }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  useEffect(() => {
    const savedDocs = localStorage.getItem('grid_notepad_documents_v2');
    const savedTheme = localStorage.getItem('grid_notepad_theme');
    const savedAccent = localStorage.getItem('grid_notepad_accent') as keyof typeof COLOR_THEMES;
    
    if (savedAccent && COLOR_THEMES[savedAccent]) {
       setAccentColor(savedAccent);
    }
    
    // Initial theme setup handled by the new themeSync useEffect
    
    if (savedDocs) {
       setDocuments(JSON.parse(savedDocs));
    } else {
       // Migrate from older version if exists
       const oldRows = localStorage.getItem('grid_notepad_rows');
       const oldHeaders = localStorage.getItem('grid_notepad_headers');
       if (oldRows) {
          const doc: GridDocument = {
             id: `doc-${Date.now()}`,
             title: 'Struktura e Vjetër',
             createdAt: new Date().toISOString(),
             updatedAt: new Date().toISOString(),
             headers: oldHeaders ? JSON.parse(oldHeaders) : ['Kolona 1', 'Kolona 2', 'Kolona 3', 'Kolona 4'],
             rows: JSON.parse(oldRows)
          };
          setDocuments([doc]);
          localStorage.setItem('grid_notepad_documents_v2', JSON.stringify([doc]));
       }
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const theme = COLOR_THEMES[accentColor];
    root.style.setProperty('--accent-50', theme[50]);
    root.style.setProperty('--accent-400', theme[400]);
    root.style.setProperty('--accent-500', theme[500]);
    root.style.setProperty('--accent-600', theme[600]);
    root.style.setProperty('--accent-700', theme[700]);
    localStorage.setItem('grid_notepad_accent', accentColor);
  }, [accentColor]);

  useEffect(() => {
    if (themeSync) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setIsDark(mediaQuery.matches);
        if (mediaQuery.matches) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
        
        const handleChange = (e: MediaQueryListEvent) => {
            setIsDark(e.matches);
            if (e.matches) document.documentElement.classList.add('dark');
            else document.documentElement.classList.remove('dark');
        };
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
        const savedTheme = localStorage.getItem('grid_notepad_theme');
        if (savedTheme === 'light') {
          setIsDark(false);
          document.documentElement.classList.remove('dark');
        } else {
          setIsDark(true);
          document.documentElement.classList.add('dark');
        }
    }
  }, [themeSync]);

  const toggleTheme = () => {
    if (themeSync) {
        setThemeSync(false);
        localStorage.setItem('grid_theme_sync', 'false');
    }
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('grid_notepad_theme', newTheme ? 'dark' : 'light');
    if (newTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const getEmptyRows = () => {
    return Array.from({length: 90}, (_, i) => ({ 
      id: `row-${i}`, status: 'none' as const, image: '' 
    }));
  };

  const updateActiveDocumentState = (newTitle: string, newRows: GridRow[], newHeaders: string[], newWidths: number[] = columnWidths) => {
     let updatedDocs = [...documents];
     const existingDocIndex = updatedDocs.findIndex(d => d.id === activeDocId);
     
     const updatedDoc = {
        id: activeDocId!,
        title: newTitle,
        createdAt: existingDocIndex >= 0 ? updatedDocs[existingDocIndex].createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        headers: newHeaders,
        columnWidths: newWidths,
        rows: newRows
     };

     if (existingDocIndex >= 0) {
        updatedDocs[existingDocIndex] = updatedDoc;
     } else {
        updatedDocs.unshift(updatedDoc);
     }
     
     setDocuments(updatedDocs);
     triggerAutoSave(updatedDocs);
  };

  const createNewDocument = () => {
    setActiveDocId(`doc-${Date.now()}`);
    setTitle(t('Shënim i Paemërtuar', 'Untitled Note'));
    setRows(getEmptyRows());
    setHeaders([t('Kolona 1', 'Column 1'), t('Kolona 2', 'Column 2'), t('Kolona 3', 'Column 3'), t('Kolona 4', 'Column 4')]);
    setSelectedRows(new Set());
  };

  const openDocument = (doc: GridDocument) => {
    setActiveDocId(doc.id);
    setTitle(doc.title);
    
    const newRows = [...doc.rows];
    const hasContent = (r: GridRow) => (doc.headers.some((_, i) => (r[`col${i+1}`] || '').toString().trim()) || r.image) ? true : false;
    if (newRows.length > 0) {
        const firstRowIsUsed = hasContent(newRows[0]) || (newRows[0].status && newRows[0].status !== 'none');
        if (firstRowIsUsed) {
            const firstEmptyIndex = newRows.findIndex(r => !hasContent(r) && r.status === 'none' && !r.image);
            if (firstEmptyIndex !== -1) {
                const emptyRow = newRows.splice(firstEmptyIndex, 1)[0];
                newRows.unshift(emptyRow);
            } else {
                newRows.unshift({ id: `row-${Date.now()}-first`, status: 'none', image: '' });
            }
        }
    }
    setRows(newRows);
    
    setHeaders(doc.headers);
    setColumnWidths(doc.columnWidths || []);
    setSelectedRows(new Set());
  };

  const deleteDocument = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    executeProtectedAction(async () => {
       const updatedDocs = documents.filter(d => d.id !== id);
       setDocuments(updatedDocs);
       localStorage.setItem('grid_notepad_documents_v2', JSON.stringify(updatedDocs));
       if (user) {
          try { await deleteDoc(doc(db, 'documents', id)); } catch(e) {}
       }
       showToast('Dokumenti u fshi!');
    });
  };

  const saveCurrentDocument = () => {
     updateActiveDocumentState(title, rows, headers);
     showToast("U ruajt me sukses!");
  };

  const updateCell = (rIndex: number, colKey: string, value: string) => {
     const newRows = [...rows];
     newRows[rIndex] = { ...newRows[rIndex], [colKey]: value };
     setRows(newRows);
     updateActiveDocumentState(title, newRows, headers);
  };

  const updateSelectedRowsStatus = (newStatus: string) => {
     if (selectedRows.size === 0) {
         showToast("Zgjidhni rrjeshta (klikoni numrat majtas) për të ndryshuar statusin!");
         return;
     }

     executeProtectedAction(() => {
         const newRows = [...rows];
         
         const hasContent = (r: GridRow) => (headers.some((_, i) => (r[`col${i+1}`] || '').toString().trim()) || r.image) ? true : false;
         
         selectedRows.forEach(rIndex => {
             newRows[rIndex].status = newStatus;
         });

         newRows.sort((a, b) => {
             const getOrder = (row: GridRow) => {
                 if (row.status === 'ok') return 1;
                 if (row.status === 'blue') return 2;
                 if (row.status?.startsWith('tag-')) return 3;
                 if (row.status === 'none' && hasContent(row)) return 4;
                 if (row.status === 'x') return 5;
                 return 6;
             };
             
             const orderA = getOrder(a);
             const orderB = getOrder(b);
             return orderA - orderB;
         });
         
         // Siguro që rrjeshti i parë të jetë gjithmonë bosh për shënim (Rule applied: always keep first row empty)
         const firstRowIsUsed = hasContent(newRows[0]) || (newRows[0].status && newRows[0].status !== 'none');
         if (firstRowIsUsed) {
             const firstEmptyIndex = newRows.findIndex(r => !hasContent(r) && r.status === 'none' && !r.image);
             if (firstEmptyIndex !== -1) {
                 const emptyRow = newRows.splice(firstEmptyIndex, 1)[0];
                 newRows.unshift(emptyRow);
             } else {
                 newRows.unshift({
                     id: `row-${Date.now()}-first`,
                     status: 'none',
                     image: ''
                 });
             }
         }
         
         setRows(newRows);
         updateActiveDocumentState(title, newRows, headers);
         setSelectedRows(new Set());
     });
  };

  const handleImageUpload = (rIndex: number, file: File) => {
     const reader = new FileReader();
     reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
           const canvas = document.createElement('canvas');
           const MAX_WIDTH = 800; // Resize to save memory
           const MAX_HEIGHT = 800;
           let width = img.width;
           let height = img.height;
           if (width > height) {
              if (width > MAX_WIDTH) {
                 height *= MAX_WIDTH / width;
                 width = MAX_WIDTH;
              }
           } else {
              if (height > MAX_HEIGHT) {
                 width *= MAX_HEIGHT / height;
                 height = MAX_HEIGHT;
              }
           }
           canvas.width = width;
           canvas.height = height;
           const ctx = canvas.getContext('2d');
           if (ctx) {
               ctx.drawImage(img, 0, 0, width, height);
               const dataUrl = canvas.toDataURL('image/jpeg', 0.6); // Compress
               const newRows = [...rows];
               newRows[rIndex].image = dataUrl;
               setRows(newRows);
               updateActiveDocumentState(title, newRows, headers);
           }
        };
        img.src = e.target?.result as string;
     };
     reader.readAsDataURL(file);
  };

  const removeImage = (rIndex: number) => {
     const newRows = [...rows];
     newRows[rIndex].image = '';
     setRows(newRows);
     updateActiveDocumentState(title, newRows, headers);
  };

  const generatePlaceholderImage = async (rIndex: number) => {
      showToast("Duke gjeneruar imazhin...");
      try {
          const seed = Math.random().toString(36).substring(7);
          const url = `https://picsum.photos/seed/${seed}/200/200`;
          const res = await fetch(url);
          const blob = await res.blob();
          const reader = new FileReader();
          reader.onload = (e) => {
              const dataUrl = e.target?.result as string;
              const newRows = [...rows];
              newRows[rIndex].image = dataUrl;
              setRows(newRows);
              updateActiveDocumentState(title, newRows, headers);
              showToast("Imazhi u gjenerua!");
          };
          reader.readAsDataURL(blob);
      } catch (err) {
          showToast("Gabim gjatë gjenerimit të imazhit!");
      }
  };

  const toggleRowSelection = (rIndex: number) => {
    const newSel = new Set(selectedRows);
    if (newSel.has(rIndex)) {
      newSel.delete(rIndex);
    } else {
      newSel.add(rIndex);
    }
    setSelectedRows(newSel);
  };
  
  const toggleAllSelection = () => {
     if (selectedRows.size === rows.length) {
       setSelectedRows(new Set());
     } else {
       setSelectedRows(new Set(rows.map((_, i) => i)));
     }
  };

  const handleClearAll = () => {
     const empty = getEmptyRows();
     setRows(empty);
     setSelectedRows(new Set());
     setShowConfirmClear(false);
     updateActiveDocumentState(title, empty, headers);
     showToast("Të gjitha 90 rrjeshtat u boshatisën!");
  };

  const handleDeleteSelected = () => {
     const newRows = rows.map((r, index) => {
         if (selectedRows.has(index)) {
             return { id: r.id, status: 'none' as const, image: '' };
         }
         return r;
     });
     
     setRows(newRows);
     setSelectedRows(new Set());
     setShowConfirmDeleteSelected(false);
     updateActiveDocumentState(title, newRows, headers);
     showToast("Rrjeshtat u boshatisën (struktura u ruajt)!");
  };



  const handleDownload = async (blob: Blob, filename: string, mimeType: string, shareTitle: string) => {
      try {
          if (downloadMethod === 'folder') {
              let rootHandle = await getDirectoryHandle();
              
              if (!rootHandle && typeof (window as any).showDirectoryPicker === 'function' && window.self === window.top) {
                  try {
                      rootHandle = await (window as any).showDirectoryPicker({ mode: 'readwrite' });
                      await saveDirectoryHandle(rootHandle);
                  } catch(e) {
                      console.error(e);
                  }
              }
              
              if (rootHandle) {
                  try {
                      const fileHandle = await rootHandle.getFileHandle(filename, { create: true });
                      const writable = await fileHandle.createWritable();
                      await writable.write(blob);
                      await writable.close();
                      showToast(`U ruajt drejtpërdrejt në dosjen: ${rootHandle.name}`);
                      return;
                  } catch (e: any) {
                      console.error(e);
                      showToast("Gabim gjatë ruajtjes në dosje. Riprovoni ose rregulloni lejet.");
                  }
              } else {
                  let savedFolder = localStorage.getItem('grid_mock_folder') || folderName;
                  
                  if (savedFolder) {
                      showToast(`U sinkronizua automatikisht drejt dosjes: '${savedFolder}'`);
                      const sanitizedFolder = savedFolder.replace(/[^a-zA-Z0-9_\s-]/g, '').trim();
                      const finalFilename = sanitizedFolder ? `${sanitizedFolder}_${filename}` : filename;
                      
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = finalFilename;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                      return;
                  } else {
                      showToast("Dosja nuk është zgjedhur! Shkoni tek Settings për ta zgjedhur.");
                  }
                  
                  // Përdor shkarkimin standard nëse dosja nuk u gjet
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = filename;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                  return;
              }
          }
          
          if (downloadMethod === 'picker') {
              if ('showSaveFilePicker' in window && window.self === window.top) {
                  try {
                      // Kjo thirrje provon të hapë direkt File Manager (OS Picker)
                      const handle = await (window as any).showSaveFilePicker({
                          suggestedName: filename,
                          types: [{ description: 'File', accept: { [mimeType]: [`.${filename.split('.').pop()}`] } }]
                      });
                      const writable = await handle.createWritable();
                      await writable.write(blob);
                      await writable.close();
                      showToast(t("Skedari u ruajt me sukses në dosjen e zgjedhur!", "File saved successfully!"));
                      return;
                  } catch (err: any) {
                      if (err.name === 'AbortError') return;
                      showToast("Nuk mund të hapet File Manager direkt. Provoni opsionin 'Filemanager Internal/Folder'.");
                      return;
                  }
              } else {
                  showToast("Hapja direkte kërkon PC. Në celular përdorni opsionin 'Filemanager Internal/Folder'.");
                  return;
              }
          }
          
          if (downloadMethod === 'auto') {
               // On PC, try picker first
               if ('showSaveFilePicker' in window && window.self === window.top && !/Mobi/i.test(navigator.userAgent)) {
                   try {
                       const handle = await (window as any).showSaveFilePicker({
                           suggestedName: filename,
                           types: [{ description: 'File', accept: { [mimeType]: [`.${filename.split('.').pop()}`] } }]
                       });
                       const writable = await handle.createWritable();
                       await writable.write(blob);
                       await writable.close();
                       showToast(t("Skedari u ruajt me sukses në dosjen e zgjedhur!", "File saved successfully!"));
                       return;
                   } catch (err: any) {
                        if (err.name === 'AbortError') return;
                        // fallthrough
                   }
               }

               // On Mobile (or if Picker failed), try share first
               try {
                   const file = new File([blob], filename, { type: mimeType });
                   if (navigator.canShare && navigator.canShare({ files: [file] })) {
                       await navigator.share({
                           files: [file],
                           title: shareTitle,
                       });
                       showToast(t("Zgjidhni 'Save to Files' në menunë e shfaqur.", "Select 'Save to Files' from the menu."));
                       return;
                   }
               } catch (err: any) {
                   if (err.name === 'AbortError') return;
                   // fallthrough
               }
          }

          if (downloadMethod === 'share') {
              try {
                  if ('showSaveFilePicker' in window && window.self === window.top) {
                      try {
                          const handle = await (window as any).showSaveFilePicker({
                              suggestedName: filename,
                              types: [{ description: 'File', accept: { [mimeType]: [`.${filename.split('.').pop()}`] } }]
                          });
                          const writable = await handle.createWritable();
                          await writable.write(blob);
                          await writable.close();
                          showToast("U ruajt në dosjen e zgjedhur!");
                          return;
                      } catch(ex: any) {
                          if (ex.name === 'AbortError') return;
                      }
                  }

                  const file = new File([blob], filename, { type: mimeType });
                  if (navigator.canShare && navigator.canShare({ files: [file] })) {
                      try {
                          await navigator.share({
                              files: [file],
                              title: shareTitle,
                          });
                          showToast(t("Tani zgjidhni File Manager / 'Save to Files' në ekran.", "Now choose File Manager / 'Save to Files'."));
                          return;
                      } catch (e: any) {
                          if (e.name === 'AbortError') return;
                          
                          // Fallback on iframe share errors (NotAllowedError etc)
                          console.error("Share error:", e);
                          showToast(t("Dritarja e ndarjes nuk mbështetet këtu, po shkarkohet direkt.", "Share not supported here, downloading directly."));
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = filename;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                          return;
                      }
                  } else {
                      showToast("Ndarja nuk mbështetet. Po shkarkojmë direkt sekondar.");
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = filename;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                      return;
                  }
              } catch (err: any) {
                  if (err.name !== 'AbortError') showToast("Dështoi hapja e File Manager.");
                  return;
              }
          }

          // Direct Download Fallback / Default
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          showToast(t("Skedari u ruajt direkt në 'Downloads'!", "File saved directly to 'Downloads'!"));
      } catch (err) {
          showToast("Gabim gjatë shkarkimit!");
      }
  };

  const exportTxt = async () => {
    let txt = `${title.toUpperCase()} (90 Rrjeshta)\n\n`;
    rows.forEach((r, i) => {
       let hasAny = headers.some((_, c) => (r[`col${c+1}`] || '').toString().trim());
       if (hasAny) {
          txt += `--- Rrjeshti ${i+1} ---\n`;
          headers.forEach((h, c) => {
             const val = (r[`col${c+1}`] || '').toString().trim();
             if (val) txt += `${h}: ${val}\n`;
          });
          txt += "\n";
       }
    });

    const blob = new Blob([txt], { type: 'text/plain' });
    const filename = `${title.replace(/\s+/g, '_')}.txt`;
    
    await handleDownload(blob, filename, 'text/plain', 'Eksport TXT');
  };

  const exportCsv = async () => {
    let hasContent = false;
    rows.forEach(r => {
       if (headers.some((_, i) => (r[`col${i+1}`] || '').toString().trim()) || r.image) hasContent = true;
    });

    if (!hasContent) {
       showToast("Blloku është bosh!");
       return;
    }

    const csvRows = [];
    csvRows.push(headers.map(h => `"${h.replace(/"/g, '""')}"`).join(","));

    rows.forEach(r => {
      let hasAny = headers.some((_, c) => (r[`col${c+1}`] || '').toString().trim()) || r.image;
      if (hasAny) {
         csvRows.push(headers.map((_, c) => `"${(r[`col${c+1}`] || '').toString().trim().replace(/"/g, '""')}"`).join(','));
      }
    });

    const csvContent = csvRows.join("\n");
    const filename = `${title.replace(/\s+/g, '_')}.csv`;
    
    const performSave = async () => {
       const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
       await handleDownload(blob, filename, 'text/csv', 'Eksport CSV');
    };

    performSave();
  };

  const exportPdf = () => {
    let hasContent = false;
    rows.forEach(r => {
       if (headers.some((_, i) => (r[`col${i+1}`] || '').toString().trim()) || r.image) hasContent = true;
    });

    if (!hasContent) {
       showToast("Blloku është bosh!");
       return;
    }

    const doc = new jsPDF();
    let y = 20;
    doc.setFontSize(16);
    doc.text(title, 20, y);
    y += 10;
    doc.setFontSize(10);
    
    rows.forEach((r, i) => {
       let hasAny = headers.some((_, c) => (r[`col${c+1}`] || '').toString().trim()) || r.image;
       if (hasAny) {
          let rowText = `Rrjeshti ${i+1}:`;
          headers.forEach((h, c) => {
             const val = (r[`col${c+1}`] || '').toString().trim();
             if (val) rowText += `\n- ${h}: ${val.replace(/\n/g, ' ')}`;
          });
          
          if (rowText.trim() !== `Rrjeshti ${i+1}:`) {
              const split = doc.splitTextToSize(rowText, 170);
              if (y + split.length * 5 > 280) {
                 doc.addPage();
                 y = 20;
              }
              doc.text(split, 20, y);
              y += split.length * 5 + 5;
          }

          if (r.image) {
              if (y + 45 > 280) {
                 doc.addPage();
                 y = 20;
              }
              // Add image. Format assumed JPEG/PNG. Data url usually has metadata.
              try {
                  doc.addImage(r.image, 'JPEG', 30, y, 40, 40);
                  y += 45;
              } catch (e) {
                  // Fallback if image type unsupported by jspd
                  doc.text('[Imazhi nuk mund të renderizohej]', 30, y);
                  y += 10;
              }
          }
          y += 5;
       }
    });

    const performSave = async (docObj: jsPDF, filename: string) => {
       const blob = docObj.output('blob');
       await handleDownload(blob, filename, 'application/pdf', 'Eksport PDF');
    };

    performSave(doc, `${title.replace(/\s+/g, '_')}.pdf`);
  };

  const openModal = (rIndex: number, colKey: string) => {
     setActiveCell({ rIndex, colKey });
     setModalText(rows[rIndex][colKey as keyof GridRow] as string);
  };

  const closeModal = () => {
     setActiveCell(null);
  };

  const saveModal = () => {
     if (activeCell) {
        updateCell(activeCell.rIndex, activeCell.colKey, modalText);
        closeModal();
     }
  };

  const baseBg = isDark ? "bg-[#09090b]" : "bg-zinc-50";
  const borderColor = isDark ? "border-zinc-800" : "border-zinc-200";
  const textColor = isDark ? "text-zinc-50" : "text-zinc-900";
  const toolbarBg = isDark ? "bg-[#18181b]" : "bg-white";
  const inputBgDark = "bg-[#18181b] border border-[#27272a] focus:bg-[#27272a]";
  const inputBgLight = "bg-white border border-zinc-200 shadow-sm focus:bg-zinc-50";

  const exportAllPdf = async () => {
     if (documents.length === 0) {
        showToast("Nuk ka asnjë dokument për të ruajtur.");
        return;
     }
     
     const doc = new jsPDF();
     let y = 20;
     const filename = `Bllok_Arkiva_Plote_${format(new Date(), 'yyyy-MM-dd')}.pdf`;

     doc.setFontSize(20);
     doc.text("Arkiva e Plotë e Bllokut", 20, y);
     y += 15;

     documents.forEach((dItem, index) => {
         if (index > 0) {
             doc.addPage();
             y = 20;
         }
         doc.setFontSize(16);
         doc.text(`Dokumenti: ${dItem.title}`, 20, y);
         y += 10;
         doc.setFontSize(10);
         
         dItem.rows.forEach((r, i) => {
             let hasAny = dItem.headers.some((_, c) => (r[`col${c+1}`] || '').toString().trim()) || r.image;
             if (hasAny) {
                 let rowText = `Rrjeshti ${i+1}:`;
                 dItem.headers.forEach((h: string, c: number) => {
                    const val = (r[`col${c+1}`] || '').toString().trim();
                    if (val) rowText += `\n- ${h}: ${val.replace(/\n/g, ' ')}`;
                 });
                 
                 if (rowText.trim() !== `Rrjeshti ${i+1}:`) {
                     const split = doc.splitTextToSize(rowText, 170);
                     if (y + split.length * 5 > 280) { doc.addPage(); y = 20; }
                     doc.text(split, 20, y);
                     y += split.length * 5 + 5;
                 }
                 
                 if (r.image) {
                     if (y + 45 > 280) { doc.addPage(); y = 20; }
                     try {
                         doc.addImage(r.image, 'JPEG', 30, y, 40, 40);
                         y += 45;
                     } catch(e) {
                         doc.text('[Imazhi nuk mund të renderizohej]', 30, y);
                         y += 10;
                     }
                 }
                 y += 5;
             }
         });
     });

     await handleDownload(doc.output('blob'), filename, 'application/pdf', 'Arkiva PDF');
  };



  const exportAllTxt = async () => {
     if (documents.length === 0) {
        showToast("Nuk ka asnjë dokument për të ruajtur.");
        return;
     }

     let txtContent = "Arkiva e Plotë e Bllokut\n\n";
     documents.forEach((dItem, index) => {
         if (index > 0) txtContent += "\n============================================\n\n";
         txtContent += `Dokumenti: ${dItem.title}\n`;
         txtContent += `Krijuar: ${format(new Date(dItem.createdAt), 'dd.MM.yyyy HH:mm')}\n\n`;

         dItem.rows.forEach((r, i) => {
              let hasAny = dItem.headers.some((_, c) => (r[`col${c+1}`] || '').toString().trim());
              if (hasAny) {
                  txtContent += `Rrjeshti ${i+1}:\n`;
                  dItem.headers.forEach((h: string, c: number) => {
                     const val = (r[`col${c+1}`] || '').toString().trim();
                     if (val) txtContent += `- ${h}: ${val}\n`;
                  });
                  txtContent += "\n";
              }
         });
     });

     const dataBlob = new Blob([txtContent], { type: 'text/plain' });
     const filename = `Bllok_Arkiva_Plote_${format(new Date(), 'yyyy-MM-dd')}.txt`;
     
     await handleDownload(dataBlob, filename, 'text/plain', 'Arkiva TXT');
  };

  const exportAllCsv = async () => {
     if (documents.length === 0) {
        showToast("Nuk ka asnjë dokument për të ruajtur.");
        return;
     }

     let csvContent = "";
     documents.forEach((dItem, index) => {
         if (index > 0) csvContent += "\n\n";
         csvContent += `"${dItem.title.replace(/"/g, '""')}"\n`;
         
         const csvHeaders = ["Rrjeshti", ...dItem.headers];
         csvContent += csvHeaders.map(h => `"${h.replace(/"/g, '""')}"`).join(",") + "\n";
         
         dItem.rows.forEach((r, i) => {
             let hasAny = dItem.headers.some((_, c) => (r[`col${c+1}`] || '').toString().trim());
             if (hasAny) {
                const rowCsv = [(i+1).toString(), ...dItem.headers.map((_, c) => (r[`col${c+1}`] || '').toString())];
                csvContent += rowCsv.map(c => `"${c.replace(/"/g, '""')}"`).join(",") + "\n";
             }
         });
     });

     const dataBlob = new Blob([csvContent], { type: 'text/csv' });
     const filename = `Bllok_Arkiva_Plote_${format(new Date(), 'yyyy-MM-dd')}.csv`;
     
     await handleDownload(dataBlob, filename, 'text/csv', 'Arkiva CSV');
  };

  const exportLocalBackup = async () => {
    try {
       const dataStr = JSON.stringify(documents, null, 2);
       const dataBlob = new Blob([dataStr], { type: 'application/json' });
       const filename = `GridNotepad_Backup_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.json`;
       
       await handleDownload(dataBlob, filename, 'application/json', 'Backup për Notepad');
    } catch(err: any) {
       showToast("Gabim gjatë ruajtjes së kopjes rezervë.");
    }
  };

  const importLocalBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0];
     if (!file) return;
     
     const reader = new FileReader();
     reader.onload = (event) => {
        try {
           const content = event.target?.result as string;
           const parsed = JSON.parse(content) as GridDocument[];
           
           if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].id && parsed[0].rows) {
              setDocuments(parsed);
              triggerAutoSave(parsed);
              showToast("Të dhënat u rikthyen me sukses nga pajisja!");
              setBackupModal(false);
           } else {
              showToast("Skedari nuk është i vlefshëm për këtë aplikacion.");
           }
        } catch(err) {
           showToast("Skedari i dëmtuar ose i pavlefshëm.");
        }
     };
     reader.readAsText(file);
     e.target.value = ''; // reset
  };

  const forceCloudBackup = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    setIsSaving(true);
    setAutoSaveMsg('Po ngarkon në Cloud...');
    let success = true;
    for (const docObj of documents) {
        try {
            const docRef = doc(db, 'documents', docObj.id);
            await setDoc(docRef, { ...docObj, userId: currentUser.uid });
        } catch (e) {
            console.error(e);
            success = false;
        }
    }
    setIsSaving(false);
    if (success) {
        setAutoSaveMsg('Ngarkuar!');
        showToast("Të gjitha dokumentet u ruajtën në Cloud!");
    } else {
        setAutoSaveMsg('Gabim!');
        showToast("Pati një problem gjatë ngarkimit në Cloud.");
    }
    setTimeout(() => setAutoSaveMsg(''), 3000);
  };

  const handleForceChangePin = () => {
       const savedPin = localStorage.getItem('grid_notepad_pin');
       if (!savedPin) {
           setPinModal({ isOpen: true, action: null, type: 'setup' });
       } else {
           executeProtectedAction(() => {
               setTimeout(() => {
                  setPinModal({ isOpen: true, action: null, type: 'setup' });
               }, 10);
           });
       }
       setShowOptionsMenu(false);
  };

  const handleForceRemovePin = () => {
       const savedPin = localStorage.getItem('grid_notepad_pin');
       if (!savedPin) {
           showToast('Nuk keni asnjë PIN të vendosur.');
           setShowOptionsMenu(false);
           return;
       }
       executeProtectedAction(() => {
           localStorage.removeItem('grid_notepad_pin');
           showToast('PIN u fshi me sukses nga pajisja.');
       });
       setShowOptionsMenu(false);
  };

  const handleResetApp = () => {
       executeProtectedAction(() => {
            if(window.confirm('Kujdes! A jeni i sigurt që doni të FSHINI TË GJITHA të dhënat dhe dokumentet? Ky veprim NUK kthehet mbrapsht!')) {
                 localStorage.removeItem('grid_notepad_documents_v2');
                 localStorage.removeItem('grid_notepad_blue');
                 setDocuments([]);
                 setBlueText('');
                 showToast('Të gjitha të dhënat u fshinë nga pajisja.');
            }
       });
       setShowOptionsMenu(false);
  };

  const handleExportDataJson = () => {
       executeProtectedAction(async () => {
           const data = {
               documents,
               blueText,
               pin: localStorage.getItem('grid_notepad_pin') || null
           };
           const dataStr = JSON.stringify(data, null, 2);
           const dataBlob = new Blob([dataStr], { type: 'application/json' });
           const filename = `app_data_backup_${format(new Date(), 'yyyyMMdd_HHmmss')}.json`;
           
           await handleDownload(dataBlob, filename, 'application/json', 'Backup JSON');
       });
       setShowOptionsMenu(false);
  };

  const handleImportDataJson = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
          try {
              const jsonData = JSON.parse(event.target?.result as string);
              if (window.confirm('Kujdes! Importimi i këtyre të dhënave do të mbishkruajë të dhënat ekzistuese. Të vazhdojmë?')) {
                  if (jsonData.documents) {
                      localStorage.setItem('grid_notepad_documents_v2', JSON.stringify(jsonData.documents));
                      setDocuments(jsonData.documents);
                  }
                  if (jsonData.blueText !== undefined) {
                      localStorage.setItem('grid_notepad_blue', jsonData.blueText);
                      setBlueText(jsonData.blueText);
                  }
                  if (jsonData.pin !== undefined) {
                      if (jsonData.pin) {
                          localStorage.setItem('grid_notepad_pin', jsonData.pin);
                      } else {
                          localStorage.removeItem('grid_notepad_pin');
                      }
                  }
                  showToast('Të dhënat u importuan me sukses!');
              }
          } catch (err) {
              showToast('Gabim gjatë importimit të skedarit JSON.');
          }
      };
      reader.readAsText(file);
      e.target.value = '';
      setShowOptionsMenu(false);
  };

  const handleSortDocsAZ = () => {
       executeProtectedAction(() => {
           const newDocs = [...documents].sort((a, b) => a.title.localeCompare(b.title));
           setDocuments(newDocs);
           localStorage.setItem('grid_notepad_documents_v2', JSON.stringify(newDocs));
           showToast("Dokumentet u renditën A-Z.");
       });
       setShowOptionsMenu(false);
  };

  const handleSortDocsZA = () => {
       executeProtectedAction(() => {
           const newDocs = [...documents].sort((a, b) => b.title.localeCompare(a.title));
           setDocuments(newDocs);
           localStorage.setItem('grid_notepad_documents_v2', JSON.stringify(newDocs));
           showToast("Dokumentet u renditën Z-A.");
       });
       setShowOptionsMenu(false);
  };

  const handleSortDocsNewest = () => {
       executeProtectedAction(() => {
           const newDocs = [...documents].sort((a, b) => b.createdAt - a.createdAt);
           setDocuments(newDocs);
           localStorage.setItem('grid_notepad_documents_v2', JSON.stringify(newDocs));
           showToast("Dokumentet u renditën më të rejat të parat.");
       });
       setShowOptionsMenu(false);
  };

  const handleSortDocsOldest = () => {
       executeProtectedAction(() => {
           const newDocs = [...documents].sort((a, b) => a.createdAt - b.createdAt);
           setDocuments(newDocs);
           localStorage.setItem('grid_notepad_documents_v2', JSON.stringify(newDocs));
           showToast("Dokumentet u renditën më të vjetrat të parat.");
       });
       setShowOptionsMenu(false);
  };

  const handleCapitalizeTitles = () => {
       executeProtectedAction(() => {
           const newDocs = documents.map(doc => {
               const title = doc.title;
               const newTitle = title.charAt(0).toUpperCase() + title.slice(1);
               return { ...doc, title: newTitle };
           });
           setDocuments(newDocs);
           localStorage.setItem('grid_notepad_documents_v2', JSON.stringify(newDocs));
           showToast("Titujt u kapitalizuan me sukses.");
       });
       setShowOptionsMenu(false);
  };

  const handleRemoveAllRowStatuses = () => {
       executeProtectedAction(() => {
           let statusesRemoved = 0;
           const newDocs = documents.map(doc => {
               const cleanRows = doc.rows.map(r => {
                   if (r.status !== 'none' && r.status !== 'lock') {
                       statusesRemoved++;
                       return { ...r, status: 'none' };
                   }
                   return r;
               });
               return { ...doc, rows: cleanRows };
           });
           if (statusesRemoved > 0) {
               setDocuments(newDocs);
               localStorage.setItem('grid_notepad_documents_v2', JSON.stringify(newDocs));
               showToast(`U fshinë ${statusesRemoved} statuse ngjyrash nga rrjeshtat.`);
           } else {
               showToast("Nuk kishte asnjë status rrjeshti për të fshirë.");
           }
       });
       setShowOptionsMenu(false);
  };

  const handleDeleteEmptyDocs = () => {
       executeProtectedAction(() => {
           let emptyCount = 0;
           const newDocs = documents.filter(doc => {
               const hasData = doc.rows.some(r => doc.headers.some((_, c) => (r[`col${c+1}`] || '').toString().trim()) || r.image);
               if (!hasData) emptyCount++;
               return hasData;
           });
           if (emptyCount > 0) {
               setDocuments(newDocs);
               localStorage.setItem('grid_notepad_documents_v2', JSON.stringify(newDocs));
               showToast(`U fshinë me sukses ${emptyCount} dokumente bosh.`);
           } else {
               showToast("Nuk u gjetën dokumente bosh.");
           }
       });
       setShowOptionsMenu(false);
  };

  const handleCleanupEmptyRowsAll = () => {
       executeProtectedAction(() => {
           let totalCleaned = 0;
           const newDocs = documents.map(doc => {
               const originalLen = doc.rows.length;
               const cleanRows = doc.rows.filter(r => doc.headers.some((_, c) => (r[`col${c+1}`] || '').toString().trim()) || r.image);
               totalCleaned += (originalLen - cleanRows.length);
               return { ...doc, rows: cleanRows };
           });
           if (totalCleaned > 0) {
               setDocuments(newDocs);
               localStorage.setItem('grid_notepad_documents_v2', JSON.stringify(newDocs));
               showToast(`U pastruan ${totalCleaned} rrjeshta bosh kudo.`);
           } else {
               showToast("Nuk kishte asnjë rrjesht bosh për t'u pastruar.");
           }
       });
       setShowOptionsMenu(false);
  };

  const handleStripAllImages = () => {
       executeProtectedAction(() => {
           if(window.confirm('Kujdes! Dëshironi të fshini të gjitha imazhet nga aplikacioni për të kursyer hapësirën (Storage)? Kjo nuk zhbëhet!')) {
               let imagesRemoved = 0;
               const newDocs = documents.map(doc => {
                   const cleanRows = doc.rows.map(r => {
                       if (r.image) imagesRemoved++;
                       return { ...r, image: null };
                   });
                   return { ...doc, rows: cleanRows };
               });
               if (imagesRemoved > 0) {
                   setDocuments(newDocs);
                   localStorage.setItem('grid_notepad_documents_v2', JSON.stringify(newDocs));
                   showToast(`U fshinë me sukses ${imagesRemoved} imazhe.`);
               } else {
                   showToast("Asnjë imazh nuk u gjet.");
               }
           }
       });
       setShowOptionsMenu(false);
  };

  const handleResetVisualSettings = () => {
       setIsDark(true);
       setAccentColor('blue');
       showToast("Parametrat vizualë u kthyen në vlerat fillestare!");
       setShowOptionsMenu(false);
  };

  const handleRefreshCache = () => {
      showToast('Po pastrohet cache...');
      setTimeout(() => {
          window.location.reload();
      }, 1000);
      setShowOptionsMenu(false);
  };

  const filteredDocs = documents.filter(doc => {
     if (!catalogSearch.trim()) return true;
     const q = catalogSearch.toLowerCase();
     if (doc.title.toLowerCase().includes(q)) return true;
     return doc.rows.some(r => 
        headers.some((_, c) => (r[`col${c+1}`] || '').toString().toLowerCase().includes(q))
     );
  });

  // LOCK SCREEN VIEW
  const handleAppUnlock = () => {
      const savedPin = localStorage.getItem('grid_notepad_pin');
      if (appLockInput === savedPin) {
          setAppLocked(false);
          setAppLockInput('');
      } else {
          showToast('PIN i gabuar!');
          setAppLockInput('');
      }
  };

  const renderSharedModals = () => (
    <>
      {/* CONFIRMATION MODAL - DELETE DOC */}
      {docToDelete && (
         <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4 animate-in fade-in">
            <div className={`max-w-md w-full p-6 rounded-2xl shadow-2xl border ${isDark ? "bg-zinc-900 border-zinc-700" : "bg-white border-zinc-300"}`}>
               <h3 className={`text-xl font-bold mb-3 text-red-500`}>{t('Kujdes!', 'Warning!')}</h3>
               <p className={`mb-6 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                  {t('Jeni i sigurt që doni ta fshini listën: ', 'Are you sure you want to delete the list: ')}
                  <strong className={isDark ? "text-zinc-200" : "text-zinc-800"}>
                     "{documents.find(d => d.id === docToDelete)?.title || t('Pa titull', 'Untitled')}"
                  </strong>
                  {t('? Ky veprim nuk mund të kthehet mbrapsht.', '? This action cannot be undone.')}
               </p>
               <div className="flex justify-end gap-3">
                  <button onClick={() => setDocToDelete(null)} className={`px-4 py-2 font-medium rounded-lg transition-colors ${isDark ? "text-zinc-300 hover:bg-zinc-800" : "text-zinc-600 hover:bg-zinc-100"}`}>
                     {t('Anulo', 'Cancel')}
                  </button>
                  <button onClick={() => {
                     const id = docToDelete;
                     setDocToDelete(null);
                     const updatedDocs = documents.filter(d => d.id !== id);
                     setDocuments(updatedDocs);
                     localStorage.setItem('grid_notepad_documents_v2', JSON.stringify(updatedDocs));
                     if (user) {
                        deleteDoc(doc(db, 'documents', id)).catch(() => {});
                     }
                     if (activeDocId === id) {
                         createNewDocument();
                     }
                     showToast(t('Dokumenti u fshi!', 'Document deleted!'));
                  }} className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg transition-colors">
                     {t('Po, Fshijë', 'Yes, Delete')}
                  </button>
               </div>
            </div>
         </div>
      )}

      {/* ORANGE NOTES MODAL */}
      {blueModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 sm:p-4 animate-in fade-in">
             <div className={`w-full h-[100dvh] sm:max-w-2xl sm:h-[80vh] flex flex-col sm:rounded-2xl shadow-2xl border-0 sm:border ${isDark ? "bg-zinc-900 sm:border-blue-500/30" : "bg-white sm:border-blue-300"}`}>
                <div className={`flex justify-between items-center p-4 border-b shrink-0 ${isDark ? "border-zinc-800" : "border-zinc-200"}`}>
                   <h3 className={`text-xl font-bold flex items-center gap-2 ${isDark ? "text-blue-500" : "text-blue-600"}`}>
                      <Lock className="w-5 h-5" /> Shënime Sekrete
                   </h3>
                   <button onClick={() => setBlueModal(false)} className="p-2 bg-transparent text-zinc-500 hover:text-red-500 transition-colors">
                      <X className="w-5 h-5"/>
                   </button>
                </div>
                
                <div className={`flex-1 p-5 ${isDark ? "bg-zinc-950" : "bg-blue-50/30"}`}>
                   <textarea
                     autoFocus
                     value={blueText}
                     onChange={(e) => {
                         const val = e.target.value;
                         setBlueText(val);
                         localStorage.setItem('grid_notepad_blue', val);
                     }}
                     placeholder="Këtu mund të mbani shënime të rëndësishme ose sekrete të mbrojtura me PIN..."
                     className={`w-full h-full bg-transparent resize-none focus:outline-none text-base leading-relaxed scrollbar-hide ${
                       isDark ? "text-blue-100 placeholder-blue-900/50" : "text-zinc-800 placeholder-blue-300"
                     }`}
                     spellCheck={false}
                   />
                </div>
                
                <div className={`p-4 flex items-center justify-between border-t shrink-0 ${isDark ? "border-zinc-800" : "border-zinc-200"}`}>
                   <span className={`text-xs font-semibold flex items-center gap-1.5 ${isDark ? "text-green-500" : "text-green-600"}`}>
                     <Check className="w-3.5 h-3.5" /> Ruhet automatikisht
                   </span>
                   <button onClick={() => {
                       setBlueModal(false);
                   }} className={`px-5 py-2 font-medium rounded-lg transition-colors bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20`}>
                      Mbyll
                   </button>
                </div>
             </div>
          </div>
      )}

      {/* PIN MODAL */}
      {pinModal.isOpen && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4 animate-in fade-in">
            <div className={`max-w-sm w-full p-6 rounded-2xl shadow-2xl border ${isDark ? "bg-zinc-900 border-zinc-700" : "bg-white border-zinc-300"}`}>
               <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-xl ${pinModal.type === 'setup' ? 'bg-accent-500/10 text-accent-500' : 'bg-blue-500/10 text-blue-500'}`}>
                     {pinModal.type === 'setup' ? <Lock className="w-6 h-6" /> : <Unlock className="w-6 h-6" />}
                  </div>
                  <h3 className={`text-xl font-bold ${textColor}`}>
                     {pinModal.type === 'setup' ? 'Krijo PIN Sigurie' : 'Futni PIN'}
                  </h3>
               </div>
               
               <p className={`mb-5 text-sm ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                  {pinModal.type === 'setup' ? 'Ky veprim kërkon një kod PIN. Krijoni një kod për të mbrojtur dokumentet dhe fshirjet gabim.' : 'Për të fshirë dokumentet apo ndryshuar statuset X, ju lutem futni kodin PIN.'}
               </p>
               
               <input 
                 type="password"
                 value={pinInput}
                 onChange={(e) => setPinInput(e.target.value)}
                 pattern="[0-9]*"
                 inputMode="numeric"
                 autoFocus
                 className={`w-full text-center text-xl tracking-[0.5em] font-bold py-3 px-4 rounded-xl mb-6 border outline-none transition-colors ${
                    isDark ? "bg-zinc-950 border-zinc-700 text-white focus:border-accent-500" : "bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-accent-500"
                 }`}
                 onKeyDown={(e) => { if (e.key === 'Enter') handlePinSubmit(); }}
               />

               <div className="flex justify-end gap-3">
                  <button onClick={() => setPinModal({ isOpen: false, action: null, type: 'verify' })} className={`px-4 py-2.5 font-medium rounded-lg transition-colors ${isDark ? "text-zinc-300 hover:bg-zinc-800" : "text-zinc-600 hover:bg-zinc-100"}`}>
                     Anulo
                  </button>
                  <button onClick={handlePinSubmit} className="px-4 py-2.5 bg-accent-600 hover:bg-accent-500 text-white font-medium rounded-lg transition-colors shadow-lg">
                     Vazhdo
                  </button>
               </div>
            </div>
          </div>
      )}

      {/* AUTH MODAL */}
      {authModal && (
          <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4 animate-in fade-in">
             <div className={`max-w-md w-full p-6 rounded-2xl shadow-2xl border ${isDark ? "bg-zinc-900 border-zinc-700" : "bg-white border-zinc-300"}`}>
                <div className="flex justify-between items-center mb-6">
                   <h3 className={`text-xl font-bold ${textColor}`}>
                      {isSignUp ? 'Krijo Llogari' : 'Hyr në Llogari'}
                   </h3>
                   <button onClick={() => setAuthModal(false)} className="p-2 bg-transparent text-zinc-500 hover:text-red-500 transition-colors">
                      <X className="w-5 h-5"/>
                   </button>
                </div>

                <form onSubmit={handleEmailAuth} className="flex flex-col gap-4">
                   <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="E-mail adresa"
                      required
                      className={`w-full px-4 py-3 rounded-xl border outline-none transition-colors ${
                          isDark ? "bg-zinc-950 border-zinc-700 text-white focus:border-accent-500" : "bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-accent-500"
                      }`}
                   />
                   <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={isSignUp ? "Fjalëkalimi (min. 6 karaktere)" : "Fjalëkalimi"}
                      minLength={6}
                      required
                      className={`w-full px-4 py-3 rounded-xl border outline-none transition-colors ${
                          isDark ? "bg-zinc-950 border-zinc-700 text-white focus:border-accent-500" : "bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-accent-500"
                      }`}
                   />
                   <button type="submit" className="w-full py-3 bg-accent-600 hover:bg-accent-500 text-white font-medium rounded-xl transition-colors shadow-lg">
                      {isSignUp ? 'Krijo Llogari' : 'Hyr'}
                   </button>
                   <div className="flex items-center gap-4 my-2">
                      <div className={`flex-1 h-px ${isDark ? "bg-zinc-800" : "bg-zinc-200"}`}></div>
                      <span className={`text-sm ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>Ose</span>
                      <div className={`flex-1 h-px ${isDark ? "bg-zinc-800" : "bg-zinc-200"}`}></div>
                   </div>
                   <button type="button" onClick={loginWithGoogle} className={`w-full py-3 flex items-center justify-center gap-2 font-medium rounded-xl transition-colors border ${
                      isDark ? "bg-zinc-950 border-zinc-700 text-zinc-300 hover:bg-zinc-800" : "bg-white border-zinc-300 text-zinc-700 hover:bg-zinc-50"
                   }`}>
                      Google
                   </button>
                   <p className="text-center text-sm mt-2 text-zinc-500">
                      {isSignUp ? 'Keni një llogari? ' : 'Nuk keni llogari? '}
                      <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="text-accent-500 font-bold hover:underline">
                         {isSignUp ? 'Hyr këtu' : 'Krijo një'}
                      </button>
                   </p>
                </form>
             </div>
          </div>
      )}

      {/* AI CHAT PANEL */}
      {aiChatModal && (
          <div className="fixed top-0 right-0 z-[95] w-full max-w-[100vw] sm:w-[400px] flex flex-col shadow-2xl border-l animate-in slide-in-from-right transition-colors"
               style={{ backgroundColor: isDark ? '#18181b' : '#ffffff', borderColor: isDark ? '#3f3f46' : '#e4e4e7', height: '100dvh' }}>
             <div className={`flex justify-between items-center p-5 border-b shrink-0 ${isDark ? "border-zinc-800" : "border-zinc-200"}`}>
                <h3 className={`text-xl font-bold flex items-center gap-2 ${textColor}`}>
                   <Sparkles className="w-5 h-5 text-accent-500" /> {t('Asistenti AI', 'AI Assistant')}
                </h3>
                <button onClick={() => setAiChatModal(false)} className="p-2 bg-transparent text-zinc-500 hover:text-red-500 transition-colors">
                   <X className="w-5 h-5"/>
                </button>
             </div>
             
             <div className="p-5 overflow-y-auto flex-1 flex flex-col gap-4">
                {aiChatResponse ? (
                   <div className={`p-4 rounded-xl text-sm leading-relaxed ${isDark ? "bg-zinc-800 text-zinc-300" : "bg-zinc-50 text-zinc-700"}`}>
                      <div className="whitespace-pre-wrap">{aiChatResponse}</div>
                   </div>
                ) : (
                   <div className="flex flex-col gap-4">
                       <div className={`p-4 rounded-xl text-sm leading-relaxed ${isDark ? "bg-zinc-800 text-zinc-300" : "bg-zinc-50 text-zinc-700"}`}>
                          {t('Përshëndetje! Jam Asistenti juaj AI. Mund të analizoj të gjithë bllokun tuaj aktual, çfarëdo lloj të dhënash të keni në të (llogaritje për kg/arka, ditë pune, emra, raporte spërkatjesh, medikamente, etj). Më kërkoni t\'i analizoj apo përmbledh sipas dëshirës!', 'Hello! I am your AI Assistant. I can analyze your entire current notepad, whatever data you have in it (calculations, work days, names, spray reports, medicines, etc). Ask me to analyze or summarize as you like!')}
                       </div>
                       
                       <div className="flex flex-col gap-2 mt-4">
                          <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>{t('Sugjerime të Shpejta', 'Quick Suggestions')}</span>
                          <button 
                             onClick={() => {
                                 setAiChatInput('Të lutem analizo këtë bllok dhe më nxirr një raport të plotë bazuar në të dhënat që përmban.');
                                 askAi('Të lutem analizo këtë bllok dhe më nxirr një raport të plotë bazuar në të dhënat që përmban.');
                             }}
                             className={`text-left p-3 rounded-lg text-sm transition-colors border ${isDark ? "bg-zinc-800 border-zinc-700 hover:bg-zinc-700" : "bg-white border-zinc-200 hover:bg-zinc-50 text-zinc-800"}`}
                          >
                             📊 {t('Më nxirr një raport të detajuar', 'Generate a detailed report')}
                          </button>
                          <button 
                             onClick={() => {
                                 setAiChatInput('Pastro rrjeshtat që janë absolutisht të njëjtë dhe fshi rrjeshtat komplet bosh nëse ndodhen mes të dhënave, duke më ripërditësuar listën.');
                                 askAi('Pastro rrjeshtat që janë absolutisht të njëjtë dhe fshi rrjeshtat komplet bosh nëse ndodhen mes të dhënave, duke më ripërditësuar listën.');
                             }}
                             className={`text-left p-3 rounded-lg text-sm transition-colors border ${isDark ? "bg-zinc-800 border-zinc-700 hover:bg-zinc-700" : "bg-white border-zinc-200 hover:bg-zinc-50 text-zinc-800"}`}
                          >
                             ✨ {t('Pastro duplikatet dhe rrjeshtat bosh', 'Clean duplicates and empty rows')}
                          </button>
                       </div>
                   </div>
                )}
             </div>

             <div className={`p-4 pb-[max(1rem,env(safe-area-inset-bottom))] border-t flex flex-col gap-2 shrink-0 ${isDark ? "border-zinc-800" : "border-zinc-200"}`}>
                {(aiChatImage || aiChatAudio) && (
                   <div className="flex items-center gap-2 mb-2 flex-wrap">
                      {aiChatImage && (
                          <div className="relative group">
                             <img src={aiChatImage} className="h-14 w-14 object-cover rounded shadow ring-1 ring-zinc-500/30" />
                             <button onClick={() => setAiChatImage(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 shadow">
                                <X className="w-3 h-3" />
                             </button>
                          </div>
                      )}
                      {aiChatAudio && (
                          <div className={`flex items-center gap-2 p-2 rounded-lg text-xs ${isDark ? "bg-zinc-800 text-zinc-300" : "bg-zinc-100 text-zinc-700"}`}>
                             <Mic className="w-4 h-4 text-accent-500" /> Audio gati
                             <button onClick={() => setAiChatAudio(null)} className="text-red-500 hover:text-red-600"><X className="w-3 h-3"/></button>
                          </div>
                      )}
                   </div>
                )}
                <div className="flex flex-col sm:flex-row items-center gap-2">
                   <div className="flex items-center gap-2 w-full sm:w-auto order-last sm:order-none">
                       <label className={`cursor-pointer p-2 rounded-xl border transition-colors flex-1 sm:flex-none flex justify-center items-center ${isDark ? "bg-zinc-900 border-zinc-700 bg-zinc-700 text-white hover:bg-zinc-600 shadow-sm font-bold" : "bg-zinc-50 border-zinc-300 hover:bg-zinc-100 text-zinc-600"}`} title={t("Bashkëngjit Imazh", "Attach Image")}>
                         <ImagePlus className="w-5 h-5" />
                         <input type="file" accept="image/jpeg, image/png" className="hidden" onChange={handleAiChatImageUpload} />
                       </label>
                       <button 
                          onClick={isRecordingMime ? stopRecordingAiAudio : startRecordingAiAudio} 
                          className={`p-2 rounded-xl border transition-colors flex-1 sm:flex-none flex justify-center items-center ${isRecordingMime ? "bg-red-500 text-white shadow-lg shadow-red-500/20 border-red-500 animate-pulse" : (isDark ? "bg-zinc-900 border-zinc-700 bg-zinc-700 text-white hover:bg-zinc-600 shadow-sm font-bold" : "bg-zinc-50 border-zinc-300 hover:bg-zinc-100 text-zinc-600")}`} 
                          title={t("Regjistro Zërin", "Record Voice")}>
                         {isRecordingMime ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                       </button>
                   </div>
                   <div className="flex items-center gap-2 w-full flex-1">
                       <input
                          type="text"
                          className={`flex-1 min-w-0 px-4 py-2.5 rounded-xl border focus:outline-none focus:border-accent-500 transition-colors ${
                             isDark ? "bg-zinc-950 border-zinc-700 text-white placeholder-zinc-500" : "bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400"
                          }`}
                          placeholder={t("Shkruani pyetjen...", "Type a question...")}
                          value={aiChatInput}
                          onChange={e => {
                              const val = e.target.value;
                              setAiChatInput(val);
                              localStorage.setItem('grid_aichat_input', val);
                          }}
                          onKeyDown={e => { if(e.key === 'Enter') askAi(); }}
                       />
                       <button onClick={() => askAi()} disabled={isAiThinking || (!aiChatInput.trim() && !aiChatImage && !aiChatAudio)} className="px-4 py-2.5 bg-accent-600 hover:bg-accent-500 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-accent-600/20 flex items-center justify-center min-w-[64px] shrink-0">
                           {isAiThinking ? <Loader2 className="w-5 h-5 animate-spin"/> : t("Pyet", "Ask")}
                       </button>
                   </div>
                </div>
             </div>
          </div>
      )}

      {/* BACKUP MODAL */}
      {backupModal && (
          <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4 animate-in fade-in">
             <div className={`max-w-xl w-full max-h-[90vh] flex flex-col rounded-2xl shadow-2xl border ${isDark ? "bg-zinc-900 border-zinc-700" : "bg-white border-zinc-300"}`}>
                <div className={`flex justify-between items-center p-5 border-b ${isDark ? "border-zinc-800" : "border-zinc-200"}`}>
                   <h3 className={`text-xl font-bold flex items-center gap-2 ${textColor}`}>
                      <Database className="w-6 h-6 text-accent-500" /> {t('Sistemi i Sigurisë (Backup)', 'Security System (Backup)')}
                   </h3>
                   <button onClick={() => setBackupModal(false)} className="p-2 bg-transparent text-zinc-500 hover:text-red-500 transition-colors">
                      <X className="w-5 h-5"/>
                   </button>
                </div>
                
                <div className="p-5 overflow-y-auto flex-1 flex flex-col gap-6">
                   <p className={`text-sm ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                     {t('Riktheni ose ruani të gjitha të dhënat tuaja. Keni dy opsione: Ruajtje Online në Cloud (kërkon llogari) dhe Ruajtje manuale në pajisjen tuaj.', 'Restore or save all your data. You have two options: Cloud Auto-sync (requires account) and Manual local backup.')}
                   </p>

                   {/* Local Storage Backup */}
                   <div className={`p-4 rounded-xl border ${isDark ? "bg-zinc-800/50 border-zinc-700" : "bg-zinc-50 border-zinc-200"}`}>
                      <h4 className={`font-bold mb-2 flex items-center gap-2 ${textColor}`}>
                         <FolderDown className="w-5 h-5 text-accent-500" /> {t('Memorja e Pajisjes (Phone / PC)', 'Device Memory (Phone / PC)')}
                      </h4>
                      <p className={`text-sm mb-4 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                        {t('Shkarko një skedar të sigurt (.json) me të gjitha të dhënat dhe ruaje në pajisjen tënde. Përdore këtë skedar për të rikthyer të dhënat nëse aplikacioni fshihet.', 'Download a secure file (.json) with all your data and keep it stored locally. Use this file to restore your data if needed.')}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3">
                         <button onClick={exportLocalBackup} className={`flex-1 flex justify-center items-center gap-2 px-4 py-2 font-medium rounded-lg transition-colors border ${isDark ? "bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300" : "bg-white hover:bg-zinc-100 border-zinc-300 text-zinc-700"}`}>
                            <Download className="w-4 h-4" /> {t('Shkarko / Ruaj', 'Download / Save')}
                         </button>
                         <label className={`flex-1 flex justify-center items-center gap-2 px-4 py-2 font-medium rounded-lg transition-colors border cursor-pointer ${isDark ? "bg-accent-600/20 text-accent-400 border-accent-500/30 hover:bg-accent-600/30" : "bg-accent-500 hover:bg-accent-600 text-white shadow-md font-bold border-transparent"}`}>
                            <Upload className="w-4 h-4" /> {t('Rikthe / Ngarko', 'Restore / Upload')}
                            <input type="file" accept=".json" className="hidden" onChange={importLocalBackup} />
                         </label>
                      </div>
                   </div>

                   {/* Cloud Backup */}
                   <div className={`p-4 rounded-xl border ${isDark ? "bg-zinc-800/50 border-zinc-700" : "bg-zinc-50 border-zinc-200"}`}>
                      <h4 className={`font-bold mb-2 flex items-center gap-2 ${textColor}`}>
                         <Cloud className="w-5 h-5 text-accent-500" /> {t('Siguria në Cloud (Online)', 'Cloud Security (Online)')}
                      </h4>
                      <p className={`text-sm mb-4 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                        {t('Të dhënat tuaja rezervohen automatikisht në Cloud sapo jeni i kyçur. Mund t\'i shkarkoni përsëri edhe nëse ndërroni telefon.', 'Your data is automatically synced to the Cloud when you are logged in. You can redownload it even if you switch phones.')}
                      </p>
                      {user ? (
                         <div className="flex flex-col sm:flex-row gap-3">
                            <button onClick={() => {forceCloudBackup(); setBackupModal(false)}} className={`flex-1 flex justify-center items-center gap-2 px-4 py-2 font-medium rounded-lg transition-colors bg-accent-600 hover:bg-accent-500 text-white shadow-lg shadow-accent-600/20`}>
                               <Cloud className="w-4 h-4" /> {t('Shto në Cloud', 'Push to Cloud')}
                            </button>
                            <button onClick={() => {setBackupModal(false); openCloudModal();}} className={`flex-1 flex justify-center items-center gap-2 px-4 py-2 font-medium rounded-lg transition-colors border ${isDark ? "bg-green-600 hover:bg-green-500 text-white shadow-md border-transparent" : "bg-green-500 hover:bg-green-600 text-white shadow-md font-bold border-transparent"}`}>
                               <Download className="w-4 h-4" /> {t('Listo & Rikthe Online', 'List & Restore Online')}
                            </button>
                         </div>
                      ) : (
                         <button onClick={() => {setBackupModal(false); setAuthModal(true)}} className={`w-full flex justify-center items-center gap-2 px-4 py-2 font-medium rounded-lg transition-colors bg-accent-600 hover:bg-accent-500 text-white shadow-lg`}>
                            <LogIn className="w-4 h-4" /> {t('Kyçuni për Cloud', 'Login for Cloud')}
                         </button>
                      )}
                   </div>
                </div>
             </div>
          </div>
      )}

      {/* CLOUD MODAL */}
      {cloudModal && (
          <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4 animate-in fade-in">
             <div className={`max-w-2xl w-full max-h-[85vh] flex flex-col rounded-2xl shadow-2xl border ${isDark ? "bg-zinc-900 border-zinc-700" : "bg-white border-zinc-300"}`}>
                <div className={`flex justify-between items-center p-5 border-b ${isDark ? "border-zinc-800" : "border-zinc-200"}`}>
                   <h3 className={`text-xl font-bold flex items-center gap-2 ${textColor}`}>
                      <Cloud className="w-6 h-6 text-accent-500" /> Dokumentet Online
                   </h3>
                   <button onClick={() => setCloudModal(false)} className="p-2 bg-transparent text-zinc-500 hover:text-red-500 transition-colors">
                      <X className="w-5 h-5"/>
                   </button>
                </div>
                
                <div className="p-5 overflow-y-auto flex-1 flex flex-col gap-3">
                   {isFetchingCloud ? (
                      <div className="flex justify-center items-center py-10">
                         <Loader2 className="w-8 h-8 text-accent-500 animate-spin" />
                      </div>
                   ) : cloudDocs.length === 0 ? (
                      <div className={`text-center py-10 ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>
                         Nuk u gjet asnjë dokument online.
                      </div>
                   ) : (
                      cloudDocs.map(cDoc => (
                         <div key={cDoc.id} className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-xl gap-4 transition-colors ${
                            isDark ? "bg-zinc-950 border-zinc-800" : "bg-zinc-50 border-zinc-200"
                         }`}>
                             <div className="flex-1">
                                <h4 className={`font-bold ${textColor}`}>{cDoc.title}</h4>
                                <div className={`text-xs mt-1 flex items-center gap-3 ${isDark ? "text-zinc-500": "text-zinc-500"}`}>
                                   <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{format(new Date(cDoc.createdAt), 'dd MMM yyyy')}</span>
                                   <span className="flex items-center gap-1"><Save className="w-3 h-3" />{format(new Date(cDoc.updatedAt), 'HH:mm')}</span>
                                </div>
                             </div>
                             
                             <div className="flex flex-wrap w-full sm:w-auto items-center justify-end gap-2">
                                <button onClick={(e) => {
                                   e.preventDefault();
                                   e.stopPropagation();
                                   deleteCloudDoc(cDoc);
                                }} className={`p-3 sm:px-4 sm:py-2.5 text-sm font-medium rounded-lg transition-colors border ${
                                   isDark ? "bg-red-600 hover:bg-red-500 text-white shadow-md border-transparent" : "bg-red-500 hover:bg-red-600 text-white shadow-md font-bold border-transparent"
                                }`} title="Fshi nga Cloud">
                                   <Trash2 className="w-5 h-5 sm:w-4 sm:h-4 pointer-events-none" />
                                </button>
                                <button onClick={() => {
                                   const existing = documents.findIndex(d => d.id === cDoc.id);
                                   let newDocs = [...documents];
                                   if (existing >= 0) newDocs[existing] = cDoc;
                                   else newDocs.push(cDoc);
                                   setDocuments(newDocs);
                                   localStorage.setItem('grid_notepad_documents_v2', JSON.stringify(newDocs));
                                   showToast("Dokumenti u ruajt në memorien e telefonit!");
                                }} className={`flex-1 sm:flex-none justify-center flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors border ${
                                   isDark ? "bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300" : "bg-white hover:bg-zinc-100 border-zinc-300 text-zinc-700"
                                }`}>
                                   <FolderDown className="w-4 h-4" /> <span className="sm:hidden lg:inline">Ruaj</span>
                                </button>
                                <button onClick={() => {
                                   openDocument(cDoc);
                                   setCloudModal(false);
                                }} className={`flex-1 sm:flex-none justify-center flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors bg-accent-600 hover:bg-accent-500 text-white shadow-lg shadow-accent-600/20`}>
                                   <FolderUp className="w-4 h-4" /> <span className="sm:hidden lg:inline">Hap</span>
                                </button>
                             </div>
                         </div>
                      ))
                   )}
                </div>
             </div>
          </div>
      )}

      
    </>
  );

  const pinOverlayJSX = appLocked ? (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in">
      <div className={`max-w-sm w-full p-8 rounded-3xl shadow-2xl border flex flex-col items-center ${isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"}`}>
          <div className="w-16 h-16 rounded-full bg-accent-500/10 flex items-center justify-center mb-6">
              <Lock className="w-8 h-8 text-accent-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">{t('Blloku i Kyçur', 'Notepad Locked')}</h2>
          <p className={`text-sm text-center mb-8 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
             {t('Ju lutem futni kodin PIN për të vazhduar.', 'Please enter PIN to continue.')}
          </p>
          <input 
             type="password"
             value={appLockInput}
             onChange={e => setAppLockInput(e.target.value)}
             className={`w-full text-center text-3xl tracking-[0.5em] font-black py-4 px-4 rounded-xl mb-6 border outline-none transition-colors shadow-inner ${
                isDark ? "bg-zinc-950 border-zinc-700 text-white focus:border-accent-500" : "bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-accent-500"
             }`}
             onKeyDown={e => { if(e.key === 'Enter') handleAppUnlock(); }}
             autoFocus
             inputMode="numeric"
             placeholder="****"
          />
          <button onClick={handleAppUnlock} className="w-full py-4 bg-accent-600 hover:bg-accent-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-accent-500/20 text-lg">
             {t('Shkyç', 'Unlock')}
          </button>
      </div>
    </div>
  ) : null;

  // CATALOG VIEW
  if (!activeDocId) {
    return (
      <div 
        className={`w-full max-w-4xl mx-auto flex flex-col sm:border sm:rounded-2xl shadow-2xl relative overflow-hidden h-[100dvh] sm:min-h-[600px] sm:h-[90vh] ${baseBg} ${borderColor}`}
      >
         <div className={`flex border-b p-4 items-center justify-between shadow-sm sticky top-0 ${toolbarBg} ${borderColor} sm:rounded-t-2xl z-10`}>
            <div className="flex items-center gap-3">
               <FileText className={`w-6 h-6 ${isDark ? 'text-accent-500' : 'text-accent-600'}`} />
               <h1 className={`text-xl font-bold ${textColor}`}>{t('Bllok Shënimesh', 'Notepad')}</h1>
               {user && (
                 <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-xs font-bold ring-1 ring-green-500/20">
                    <Cloud className="w-3 h-3" /> {user.email ? user.email.split('@')[0] : 'Online'}
                 </span>
               )}
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
               {!user ? (
                   <button onClick={() => setAuthModal(true)} className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold rounded-lg transition-colors bg-accent-600 hover:bg-accent-500 text-white shadow-lg shadow-accent-600/20`}>
                      <LogIn className="w-4 h-4" /> <span className="hidden sm:inline">{t('Hyrje', 'Login')}</span>
                   </button>
               ) : (
                   <button onClick={() => signOut(auth)} className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors border ${isDark ? "bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-zinc-300" : "bg-white border-zinc-300 hover:bg-zinc-100 text-zinc-700"}`}>
                      <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">{t('Dil', 'Logout')}</span>
                   </button>
               )}
               <div className="relative">
                 <button 
                   onClick={() => setShowThemeMenu(!showThemeMenu)}
                   className={`p-2 rounded-full transition-colors ${isDark ? "bg-accent-600 hover:bg-accent-500 text-white shadow-md border-transparent" : "bg-accent-500 hover:bg-accent-600 text-white shadow-md font-bold border-transparent"}`}
                   title={t("Ndërro Ngjyrën", "Change Color")}
                 >
                   <Palette className="w-5 h-5" />
                 </button>
                 {showThemeMenu && (
                    <div className={`absolute right-0 top-full mt-2 p-2 rounded-xl border shadow-xl z-50 flex gap-2 w-[220px] max-w-[80vw] overflow-x-auto scrollbar-hide touch-pan-x ${isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"}`}>
                       {(Object.keys(COLOR_THEMES) as Array<keyof typeof COLOR_THEMES>).map(c => (
                          <button key={c} onClick={() => { setAccentColor(c); setShowThemeMenu(false); }} className="w-8 h-8 shrink-0 rounded-full border border-black/10 transition-transform hover:scale-110" style={{ backgroundColor: c === 'kontrast' ? '#000000' : COLOR_THEMES[c][500] }} title={c === 'kontrast' ? t('Kontrast i Lartë', 'High Contrast') : c} />
                       ))}
                    </div>
                 )}
               </div>
               <button 
                 onClick={toggleTheme}
                 className={`p-2 rounded-full transition-colors ${isDark ? "bg-yellow-600 hover:bg-yellow-500 text-white shadow-md border-transparent" : "bg-zinc-800 hover:bg-zinc-700 text-white shadow-md font-bold border-transparent"}`}
                 title={t("Ndërro Pamjen", "Toggle Theme")}
               >
                 {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
               </button>
               <div className="relative">
                 <button 
                   onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                   className={`p-2 rounded-full transition-colors ${isDark ? "bg-zinc-700 hover:bg-zinc-600 text-white shadow-md font-bold" : "bg-zinc-200 hover:bg-zinc-300 text-zinc-900 shadow-md font-bold"}`}
                   title={t("Opsionet e Bllokut", "Notepad Options")}
                 >
                   <Settings className="w-5 h-5" />
                 </button>
                 {showOptionsMenu && (
                    <div className={`absolute right-0 top-full mt-2 py-2 rounded-xl border shadow-xl z-[110] flex flex-col w-[320px] max-h-[80vh] overflow-y-auto overflow-x-hidden scrollbar-hide ${isDark ? "bg-zinc-900 border-zinc-800 text-zinc-300" : "bg-white border-zinc-200 text-zinc-700"}`}>
                       <h4 className="px-4 py-2 font-bold mb-1 border-b text-xs uppercase tracking-wider text-accent-500 border-zinc-500/20">{t('Organizimi i Dokumenteve', 'Document Organization')}</h4>
                       <button onClick={handleSortDocsAZ} className={`flex items-center gap-3 px-4 py-3 text-sm text-left font-medium transition-colors hover:bg-accent-500 hover:text-white`}>
                           <ArrowDownAZ className="w-4 h-4 shrink-0" /> {t('Rendit A-Z (Titulli)', 'Sort A-Z (Title)')}
                       </button>
                       <button onClick={handleSortDocsZA} className={`flex items-center gap-3 px-4 py-3 text-sm text-left font-medium transition-colors hover:bg-accent-500 hover:text-white`}>
                           <ArrowUpAZ className="w-4 h-4 shrink-0" /> {t('Rendit Z-A (Titulli)', 'Sort Z-A (Title)')}
                       </button>
                       <button onClick={handleSortDocsNewest} className={`flex items-center gap-3 px-4 py-3 text-sm text-left font-medium transition-colors hover:bg-accent-500 hover:text-white`}>
                           <CalendarDays className="w-4 h-4 shrink-0" /> {t('Më Të Rejat (Data)', 'Newest (Date)')}
                       </button>
                       <button onClick={handleSortDocsOldest} className={`flex items-center gap-3 px-4 py-3 text-sm text-left font-medium transition-colors hover:bg-accent-500 hover:text-white`}>
                           <Calendar className="w-4 h-4 shrink-0" /> {t('Më Të Vjetrat (Data)', 'Oldest (Date)')}
                       </button>
                       
                       <div className="h-px w-full my-1 border-b border-zinc-500/20"></div>
                       <h4 className="px-4 py-2 font-bold mb-1 text-xs uppercase tracking-wider text-accent-500">{t('Gjuha / Language', 'Language / Gjuha')}</h4>
                       <button onClick={() => { const next = language === 'sq' ? 'en' : 'sq'; setLanguage(next); localStorage.setItem('grid_lang', next); }} className={`flex items-center gap-3 px-4 py-3 text-sm text-left font-medium transition-colors hover:bg-accent-500 hover:text-white`}>
                           <Settings className="w-4 h-4 shrink-0" /> {t('Gjuha Aktuale: Shqip (Kliko)', 'Current Language: EN (Click)')}
                       </button>

                       <div className="h-px w-full my-1 border-b border-zinc-500/20"></div>

                       <h4 className="px-4 py-2 font-bold mb-1 text-xs uppercase tracking-wider text-purple-500">{t('Editimi në Masë (Batch)', 'Bulk Editing (Batch)')}</h4>
                       <button onClick={handleCapitalizeTitles} className={`flex items-center gap-3 px-4 py-3 text-sm text-left font-medium transition-colors hover:bg-purple-600 hover:text-white`}>
                           <CaseSensitive className="w-4 h-4 shrink-0" /> {t('Kapitalizo Titujt e Dokumenteve', 'Capitalize Document Titles')}
                       </button>
                       <button onClick={handleRemoveAllRowStatuses} className={`flex items-center gap-3 px-4 py-3 text-sm text-left font-medium transition-colors hover:bg-purple-600 hover:text-white`}>
                           <RemoveFormatting className="w-4 h-4 shrink-0" /> {t('Hiq Ngjyrat e Rrjeshtave (Statuset)', 'Remove Row Colors (Statuses)')}
                       </button>
                       <div className="h-px w-full my-1 border-b border-zinc-500/20"></div>

                       <h4 className="px-4 py-2 font-bold mb-1 text-xs uppercase tracking-wider text-accent-500">{t('Siguria & Aksesi', 'Security & Access')}</h4>
                       <button onClick={handleForceChangePin} className={`flex items-center gap-3 px-4 py-3 text-sm text-left font-medium transition-colors hover:bg-accent-500 hover:text-white`}>
                           <Lock className="w-4 h-4 shrink-0" /> {t('Ndrysho / Setup Kodin PIN', 'Change / Setup PIN Code')}
                       </button>
                       <button onClick={handleForceRemovePin} className={`flex items-center gap-3 px-4 py-3 text-sm text-left font-medium transition-colors hover:bg-accent-500 hover:text-white`}>
                           <Unlock className="w-4 h-4 shrink-0" /> {t('Çaktivizo Kodin PIN', 'Disable PIN Code')}
                       </button>

                       <div className="h-px w-full my-1 border-b border-zinc-500/20"></div>
                       <h4 className="px-4 py-2 font-bold mb-1 text-xs uppercase tracking-wider text-sky-500 flex items-center gap-2">
                          <Cloud className="w-4 h-4" /> {t('Sinkronizimi (Cloud Auto-save)', 'Cloud Auto-save Frequency')}
                       </h4>
                       <div className="px-4 pb-2">
                           <select 
                               value={cloudSyncFrequency}
                               onChange={(e) => {
                                  const val = parseInt(e.target.value, 10);
                                  setCloudSyncFrequency(val);
                                  localStorage.setItem('grid_cloud_sync_freq', val.toString());
                                  if (val === -1) {
                                     showToast(t("Auto-ruajtja në Cloud u çaktivizua", "Cloud auto-save disabled"));
                                  } else {
                                     showToast(t(`Ruajtja në Cloud u bë çdo ${val/1000}s`, `Cloud auto-save set to ${val/1000}s`));
                                  }
                               }}
                               className={`w-full p-2 mt-1 rounded border text-sm font-medium focus:outline-none transition-colors ${isDark ? "bg-zinc-800 border-zinc-700 text-zinc-200 focus:border-sky-500" : "bg-zinc-100 border-zinc-300 text-zinc-800 focus:border-sky-500"}`}
                           >
                               <option value="1500">{t("E Menjëhershme (1.5 sekonda)", "Immediate (1.5 seconds)")}</option>
                               <option value="10000">{t("Çdo 10 sekonda", "Every 10 seconds")}</option>
                               <option value="30000">{t("Çdo 30 sekonda", "Every 30 seconds")}</option>
                               <option value="60000">{t("Çdo 1 minutë", "Every 1 minute")}</option>
                               <option value="-1">{t("Jo Automatik (Vetëm Manual)", "Off (Manual only)")}</option>
                           </select>
                       </div>

                       <div className="h-px w-full my-1 border-b border-zinc-500/20"></div>
                       <h4 className="px-4 py-2 font-bold mb-1 text-xs uppercase tracking-wider text-green-500">{t('Menaxhimi Lokal (JSON)', 'Local Management')}</h4>
                       <button onClick={handleExportDataJson} className={`flex items-center gap-3 px-4 py-3 text-sm text-left font-medium transition-colors hover:bg-green-600 hover:text-white`}>
                           <FileJson className="w-4 h-4 shrink-0" /> {t('Eksporto të gjitha si JSON', 'Export all as JSON')}
                       </button>
                       <label className={`flex items-center gap-3 px-4 py-3 text-sm text-left font-medium transition-colors hover:bg-green-600 hover:text-white cursor-pointer`}>
                           <UploadCloud className="w-4 h-4 shrink-0" /> {t('Importo nga JSON (Rikthe)', 'Import from JSON (Restore)')}
                           <input type="file" accept=".json" className="hidden" onChange={handleImportDataJson} />
                       </label>
                       <div className="h-px w-full my-1 border-b border-zinc-500/20"></div>

                       <h4 className="px-4 py-2 font-bold mb-1 text-xs uppercase tracking-wider text-orange-500">{t('Pamja & Tema', 'Appearance & Theme')}</h4>
                       <button onClick={() => {
                           const next = !themeSync;
                           setThemeSync(next);
                           localStorage.setItem('grid_theme_sync', next.toString());
                           showToast(next ? t('Sinkronizimi me Sistemin u aktivizua', 'System Theme Sync enabled') : t('Sinkronizimi me Sistemin u çaktivizua', 'System Theme Sync disabled'));
                       }} className={`flex items-center justify-between px-4 py-3 text-sm text-left font-medium transition-colors hover:bg-orange-600 hover:text-white`}>
                           <div className="flex items-center gap-3">
                               <Monitor className="w-4 h-4 shrink-0" /> {t('Sinkronizo me Sistemin', 'Sync with System OS')}
                           </div>
                           <div className={`w-8 h-4 rounded-full transition-colors relative ${themeSync ? 'bg-green-500' : 'bg-zinc-500'}`}>
                               <div className={`absolute top-0.5 bottom-0.5 w-3 bg-white rounded-full transition-all ${themeSync ? 'left-[18px]' : 'left-0.5'}`}></div>
                           </div>
                       </button>
                       <button onClick={handleResetVisualSettings} className={`flex items-center gap-3 px-4 py-3 text-sm text-left font-medium transition-colors hover:bg-orange-600 hover:text-white`}>
                           <Paintbrush className="w-4 h-4 shrink-0" /> {t('Rivendos Pamjen Baza', 'Reset Base Appearance')}
                       </button>

                       <div className="h-px w-full my-1 border-b border-zinc-500/20"></div>
                       <h4 className="px-4 py-2 font-bold mb-1 text-xs uppercase tracking-wider text-green-500">{t('Menaxhimi Lokal (Ruajtja e Dokumenteve)', 'Local Management (Save Documents)')}</h4>
                       <div className="px-4 py-2 flex flex-col gap-2">
                           <div className="flex flex-col gap-1.5 items-start p-2 rounded bg-green-500/10 border border-green-500/20">
                               <label className="flex items-center gap-2 text-sm cursor-pointer hover:opacity-80 transition-opacity">
                                   <input type="radio" checked={downloadMethod === 'folder'} onChange={() => { setDownloadMethod('folder'); localStorage.setItem('grid_download_method', 'folder'); }} className="accent-green-500" />
                                   <span className="leading-tight font-semibold text-green-600 dark:text-green-500">
                                       Lidh Dosjen e Bllokut (Kërkon Android/PC)
                                       <br/><span className="text-[10px] text-zinc-500 font-normal">Zgjidh një dosje specifik të telefonit tënd dhe mos pyet më!</span>
                                   </span>
                               </label>
                               {downloadMethod === 'folder' && (
                                   <div className="flex flex-col gap-2">
                                       <button onClick={async () => {
                                           try {
                                               if (typeof (window as any).showDirectoryPicker === 'function' && window.self === window.top) {
                                                   const handle = await (window as any).showDirectoryPicker({ mode: 'readwrite' });
                                                   await saveDirectoryHandle(handle);
                                                   setFolderName(handle.name);
                                                   localStorage.setItem('grid_mock_folder', handle.name);
                                                   showToast("Dosja u Lidh me Sukses!");
                                               } else {
                                                   document.getElementById('fallback-dir-picker')?.click();
                                               }
                                           } catch (e: any) {
                                               if (e.name !== 'AbortError') {
                                                   document.getElementById('fallback-dir-picker')?.click();
                                               }
                                           }
                                       }} className={`ml-6 px-3 py-1.5 text-xs font-semibold rounded shadow-sm ${isDark ? "bg-green-600 hover:bg-green-500 text-white" : "bg-green-500 hover:bg-green-600 text-white"}`}>
                                           {folderName ? `Ndrysho Dosjen (Aktuale: ${folderName})` : "Kliko për të zgjedhur Dosjen Ruajtëse"}
                                       </button>
                                       <input
                                           type="file"
                                           id="fallback-dir-picker"
                                           className="hidden"
                                           // @ts-ignore
                                           webkitdirectory="true"
                                           directory="true"
                                           onChange={(e: any) => {
                                               if (e.target.files && e.target.files.length > 0) {
                                                   const path = e.target.files[0].webkitRelativePath || e.target.files[0].name;
                                                   const folder = path ? path.split('/')[0] : "Dosja e Telefonit";
                                                   setFolderName(folder);
                                                   localStorage.setItem('grid_mock_folder', folder);
                                                   showToast(`Dosja "${folder}" u lidh me sukses!`);
                                               }
                                           }}
                                       />
                                   </div>
                               )}
                           </div>
                           <label className="flex items-center gap-2 text-sm cursor-pointer hover:opacity-80 transition-opacity mt-2">
                               <input type="radio" checked={downloadMethod === 'auto'} onChange={() => { setDownloadMethod('auto'); localStorage.setItem('grid_download_method', 'auto'); }} className="accent-green-500" />
                               {t('Auto (Rekomanduar sipas pajisjes)', 'Auto (Recommended by Device)')}
                           </label>
                           <div className="flex flex-col gap-1.5 items-start">
                               <label className="flex items-center gap-2 text-sm cursor-pointer hover:opacity-80 transition-opacity">
                                   <input type="radio" checked={downloadMethod === 'share'} onChange={() => { setDownloadMethod('share'); localStorage.setItem('grid_download_method', 'share'); }} className="accent-green-500" />
                                   <span className="leading-tight">
                                       {t('Sistemi Filemanager Internal/Folder (Për Celular)', 'Internal/Folder Filemanager System (Mobile)')}
                                       <br/><span className="text-[10px] text-zinc-500">{t('Përdor menunë e Share për të zgjedhur vendin', 'Uses Share menu to pick location')}</span>
                                   </span>
                               </label>
                           </div>
                           <label className="flex items-center gap-2 text-sm cursor-pointer hover:opacity-80 transition-opacity">
                               <input type="radio" checked={downloadMethod === 'picker'} onChange={() => { setDownloadMethod('picker'); localStorage.setItem('grid_download_method', 'picker'); }} className="accent-green-500" />
                               <span className="leading-tight">
                                   {t('Pickloader Storage (Memoria për PC)', 'Pickloader Storage (PC Memory)')}
                                   <br/><span className="text-[10px] text-zinc-500">{t('Hap dritaren për të zgjedhur dosjen manualisht në PC', 'Opens window to pick local folder on PC')}</span>
                               </span>
                           </label>
                           <label className="flex items-center gap-2 text-sm cursor-pointer hover:opacity-80 transition-opacity">
                               <input type="radio" checked={downloadMethod === 'direct'} onChange={() => { setDownloadMethod('direct'); localStorage.setItem('grid_download_method', 'direct'); }} className="accent-green-500" />
                               <span className="leading-tight">
                                   {t('Download Direkt (Dosja "Downloads")', 'Direct Download ("Downloads" folder)')}
                                   <br/><span className="text-[10px] text-zinc-500">{t('Shkarkohet direkt pa pyetur për dosje', 'Downloads straight without asking for folder')}</span>
                               </span>
                           </label>
                       </div>

                       <div className="h-px w-full my-1 border-b border-zinc-500/20"></div>
                       <h4 className="px-4 py-2 font-bold mb-1 text-xs uppercase tracking-wider text-blue-500">{t('Sistemi & Riparime', 'System & Fixes')}</h4>
                       <button onClick={handleDeleteEmptyDocs} className={`flex items-center gap-3 px-4 py-3 text-sm text-left font-medium transition-colors hover:bg-blue-600 hover:text-white`}>
                           <Trash2 className="w-4 h-4 shrink-0" /> {t('Fshi Dokumentet Bosh', 'Delete Empty Documents')}
                       </button>
                       <button onClick={handleCleanupEmptyRowsAll} className={`flex items-center gap-3 px-4 py-3 text-sm text-left font-medium transition-colors hover:bg-blue-600 hover:text-white`}>
                           <Eraser className="w-4 h-4 shrink-0" /> {t('Pastro Rrjeshtat Bosh Kudo', 'Clear Empty Rows Everywhere')}
                       </button>
                       <button onClick={handleStripAllImages} className={`flex items-center gap-3 px-4 py-3 text-sm text-left font-medium transition-colors hover:bg-blue-600 hover:text-white`}>
                           <ImageMinus className="w-4 h-4 shrink-0" /> {t('Fshi Imazhet (Liro Hapësirë)', 'Delete Images (Free Space)')}
                       </button>
                       <button onClick={handleRefreshCache} className={`flex items-center gap-3 px-4 py-3 text-sm text-left font-medium transition-colors hover:bg-blue-600 hover:text-white`}>
                           <RefreshCw className="w-4 h-4 shrink-0" /> {t('Pastro Cache & Rilarko', 'Clear Cache & Reload')}
                       </button>
                       <button onClick={handleResetApp} className={`flex items-center gap-3 px-4 py-3 text-sm text-left font-bold transition-colors hover:bg-red-500 hover:text-white text-red-500`}>
                           <RotateCcw className="w-4 h-4 shrink-0" /> {t('Fshi të gjitha të dhënat (App Reset)', 'Delete all data (App Reset)')}
                       </button>
                    </div>
                 )}
               </div>
            </div>
         </div>
         
         <div className={`px-4 py-2 border-b flex flex-col gap-2 ${isDark ? "border-zinc-800 bg-zinc-900/50" : "border-zinc-200 bg-zinc-50/80"}`}>
            <div className="flex flex-nowrap w-full gap-2 items-center overflow-x-auto scrollbar-hide snap-x pb-0.5">
               <button onClick={exportAllPdf} className={`flex-shrink-0 snap-start flex justify-center items-center gap-1.5 px-2.5 py-1.5 text-[11px] sm:text-xs font-bold rounded-lg transition-colors border active:scale-95 ${
                 isDark ? "bg-red-600 hover:bg-red-500 text-white shadow-md border-transparent" : "bg-red-500 hover:bg-red-600 text-white shadow-md font-bold border-transparent"
               }`}>
                 <FolderDown className="w-3.5 h-3.5" /> PDF
               </button>

               <button onClick={() => executeProtectedAction(() => setBlueModal(true))} className={`flex-shrink-0 snap-start flex justify-center items-center gap-1.5 px-2.5 py-1.5 text-[11px] sm:text-xs font-bold rounded-lg transition-colors border active:scale-95 ${
                 isDark ? "bg-blue-600 hover:bg-blue-500 text-white shadow-md border-transparent" : "bg-blue-500 hover:bg-blue-600 text-white shadow-md font-bold border-transparent"
               }`}>
                 <Lock className="w-3.5 h-3.5" /> Sekrete
               </button>

               <button onClick={() => setBackupModal(true)} className={`flex-shrink-0 snap-start flex justify-center items-center gap-1.5 px-2.5 py-1.5 text-[11px] sm:text-xs font-bold rounded-lg transition-colors border active:scale-95 ${
                 isDark ? "bg-accent-600 hover:bg-accent-500 text-white shadow-md border-transparent" : "bg-accent-500 hover:bg-accent-600 text-white shadow-md font-bold border-transparent"
               }`}>
                 <Database className="w-3.5 h-3.5" /> Backup
               </button>

               {user && (
                 <button onClick={openCloudModal} className={`flex-shrink-0 snap-start flex justify-center items-center gap-1.5 px-2.5 py-1.5 text-[11px] sm:text-xs font-bold rounded-lg transition-colors border shadow-sm active:scale-95 ${
                   isDark ? "bg-green-600 hover:bg-green-500 text-white shadow-md border-transparent" : "bg-green-500 hover:bg-green-600 text-white shadow-md font-bold border-transparent"
                 }`}>
                   <Cloud className="w-3.5 h-3.5" /> Platforma Cloud
                 </button>
               )}

               <button onClick={() => setAiChatModal(true)} className={`flex-shrink-0 snap-start flex justify-center items-center gap-1.5 px-2.5 py-1.5 text-[11px] sm:text-xs font-bold rounded-lg transition-colors border active:scale-95 ${
                 isDark ? "bg-purple-600 hover:bg-purple-500 text-white shadow-md border-transparent" : "bg-purple-500 hover:bg-purple-600 text-white shadow-md font-bold border-transparent"
               }`}>
                 <Sparkles className="w-3.5 h-3.5" /> AI Chat
               </button>
            </div>
            
            <div className="relative w-full">
               <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
               <input 
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  placeholder={t("Kërko dokumente ose tekst brenda tyre...", "Search documents or text inside them...")}
                  className={`w-full pl-9 pr-4 py-1.5 text-sm rounded-lg border focus:outline-none focus:border-accent-500 transition-colors ${
                     isDark ? "bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500" : "bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400"
                  }`}
               />
            </div>
         </div>
         
         <div className={`p-4 sm:p-5 flex-1 overflow-y-auto w-full max-w-full`}>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
               {/* KRIJO KARTËN E RE */}
               <button 
                 onClick={createNewDocument}
                 className={`flex items-center gap-2.5 p-2 border-2 border-dashed rounded-xl transition-all active:scale-95 text-left ${
                   isDark 
                     ? "border-zinc-700 hover:border-accent-500/80 bg-zinc-900/30 hover:bg-zinc-900/60" 
                     : "border-zinc-300 hover:border-accent-500/80 bg-zinc-50 hover:bg-zinc-100"
                 }`}
               >
                 <div className="p-1.5 bg-accent-500/10 rounded-lg">
                    <Plus className="w-4 h-4 text-accent-500" />
                 </div>
                 <div className="flex flex-col gap-0.5">
                    <span className={`text-sm font-bold ${textColor}`}>{t('Krijo të Re', 'Create New')}</span>
                    <span className={`text-[10px] font-medium leading-tight ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>{t('Strukturë me 90 Rrjeshta', '90 Rows Structure')}</span>
                 </div>
               </button>

               {/* LISTA E DOKUMENTEVE */}
               {filteredDocs.length === 0 ? (
                  <div className={`col-span-full text-center py-10 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                    {t('Asnjë dokument nuk u gjet.', 'No documents found.')}
                  </div>
               ) : filteredDocs.map(doc => (
                  <div key={doc.id} onClick={() => openDocument(doc)} className={`flex items-center justify-between p-2 border rounded-xl cursor-pointer transition-all hover:translate-x-1 ${
                     isDark ? "bg-zinc-900 border-zinc-800 hover:border-zinc-600 shadow-sm" : "bg-white border-zinc-200 hover:border-zinc-400 shadow-sm"
                  }`}>
                     <div className="flex flex-col flex-1 shadow-none min-w-0 pr-2 gap-0.5">
                        <h3 className={`font-bold text-sm truncate ${textColor}`}>{doc.title}</h3>
                        <div className={`flex flex-row flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>
                           <span className="flex items-center gap-0.5"><Calendar className="w-2.5 h-2.5 shrink-0" /> {format(new Date(doc.createdAt), 'dd MMM yyyy')}</span>
                           <span className="flex items-center gap-0.5"><Save className="w-2.5 h-2.5 shrink-0" /> {format(new Date(doc.updatedAt), 'HH:mm')}</span>
                        </div>
                     </div>
                     <button 
                        onClick={(e) => { 
                           e.preventDefault(); 
                           e.stopPropagation(); 
                           executeProtectedAction(() => {
                              setDocToDelete(doc.id);
                           });
                        }} 
                        className={`p-3 -mr-1 rounded-lg text-zinc-500 hover:text-red-500 active:text-red-600 active:bg-red-500/10 transition-colors ${isDark ? "hover:bg-zinc-800" : "hover:bg-zinc-100"}`}
                     >
                        <Trash2 className="w-5 h-5 pointer-events-none" />
                     </button>
                  </div>
               ))}
            </div>
         </div>

         {/* TOAST CUSTOM */}
         {toastMessage && (
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-accent-600 text-white px-4 py-2 rounded-lg shadow-lg font-medium text-sm animate-in fade-in slide-in-from-bottom-4 z-[100]">
               {toastMessage}
            </div>
         )}
         {renderSharedModals()}
         {pinOverlayJSX}
      </div>
    );
  }

  // ACTIVE DOCUMENT VIEW
  return (
    <>
      <div 
        className={`w-full max-w-[1200px] mx-auto flex flex-col sm:border sm:rounded-xl shadow-2xl font-sans relative overflow-hidden h-[100dvh] sm:min-h-[600px] sm:h-[90vh] ${baseBg} ${borderColor} ${textColor} z-0`}
      >
        
        {/* TOOLBAR */}
      <div className={`flex flex-wrap border-b py-0.5 px-1 sm:py-1 sm:px-1.5 gap-x-1 gap-y-1 items-center justify-between shadow-sm z-30 sticky top-0 ${toolbarBg} ${borderColor}`}>
        <div className="flex flex-col flex-grow min-w-[100px] max-w-[200px]">
           <HeaderInput 
              initialValue={title}
              onChange={(val: string) => {
                  setTitle(val);
                  updateActiveDocumentState(val, rows, headers);
              }}
              className={`font-semibold text-sm px-2 py-1 rounded w-full border transition-colors outline-none focus:border-accent-500 ${isDark ? "bg-zinc-900 border-zinc-800 text-white" : "bg-white border-zinc-300 text-zinc-900"}`}
              placeholder={t("Titulli i Shënimit", "Note Title")}
           />
           {autoSaveMsg && (
              <span className="text-[10px] text-accent-500 font-medium px-2 py-0.5 animate-in fade-in slide-in-from-top-1 absolute top-[40px] z-50 rounded bg-white dark:bg-zinc-900 shadow-md border dark:border-zinc-800 border-zinc-200">{autoSaveMsg}</span>
           )}
        </div>
        
        <div className="flex items-center relative flex-grow min-w-[100px] max-w-[160px]">
           <Search className="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-zinc-500" />
           <input 
              value={docSearch}
              onChange={(e) => setDocSearch(e.target.value)}
              placeholder={t("Kërko...", "Search...")}
              className={`w-full pl-7 pr-2 py-1 text-xs rounded border transition-colors outline-none focus:border-accent-500 ${isDark ? "bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500" : "bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400"}`}
           />
        </div>
        
        <div className="flex flex-wrap items-center gap-1 border-l pl-2 mr-1 lg:mr-0 border-zinc-500/30">
                {/* New Text Settings Buttons */}
            <div className="relative">
                <button onClick={() => { setShowTextMenu(!showTextMenu); setShowTextColorMenu(false); }} className={`p-1.5 rounded transition-colors ${isDark ? "bg-zinc-700 text-white hover:bg-zinc-600 shadow-sm" : "bg-zinc-200 text-zinc-900 hover:bg-zinc-300 shadow-sm"}`} title={t("Madhësia & Trashësia", "Size & Weight")}>
                   <Type className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
                {showTextMenu && (
                   <>
                       <div className="fixed inset-0 z-[140]" onClick={() => setShowTextMenu(false)} />
                       <div className={`absolute left-0 lg:left-1/2 lg:-translate-x-1/2 top-full mt-2 p-3 rounded-xl border shadow-xl z-[150] flex flex-col gap-3 w-[220px] ${isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"}`}>
                          <div className="flex flex-col gap-1.5">
                             <div className={`flex justify-between text-xs font-bold ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                                 <span>{t('Zmadhim', 'Zoom')}</span>
                                 <span>{textSize}px</span>
                             </div>
                             <input type="range" min="10" max="32" step="1" value={textSize} onChange={(e) => updateTextSize(parseInt(e.target.value))} className="w-full accent-accent-500" />
                          </div>
                          <div className="h-px w-full bg-zinc-500/20"></div>
                          <div className="flex flex-col gap-1.5">
                             <div className={`flex justify-between text-xs font-bold ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                                 <span>{t('Trashësi', 'Weight')}</span>
                                 <span>{textWeight}</span>
                             </div>
                             <input type="range" min="100" max="900" step="100" value={textWeight} onChange={(e) => updateTextWeight(parseInt(e.target.value))} className="w-full accent-accent-500" />
                          </div>
                       </div>
                   </>
                )}
            </div>

            <div className="relative">
                <button onClick={() => { setShowTextColorMenu(!showTextColorMenu); setShowTextMenu(false); }} className={`p-1.5 rounded transition-colors ${isDark ? "bg-zinc-700 text-white hover:bg-zinc-600 shadow-sm" : "bg-zinc-200 text-zinc-900 hover:bg-zinc-300 shadow-sm"}`} title={t("Ngjyra e Tekstit", "Text Color")}>
                   <Palette className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
                {showTextColorMenu && (
                   <>
                       <div className="fixed inset-0 z-[140]" onClick={() => setShowTextColorMenu(false)} />
                       <div className={`absolute left-0 lg:left-1/2 lg:-translate-x-1/2 top-full mt-2 p-2 rounded-xl border shadow-xl z-[150] flex flex-col gap-1.5 w-[200px] ${isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"}`}>
                          <div className="text-[10px] font-bold uppercase text-zinc-500 px-1 mb-1 border-b border-zinc-500/20 pb-1">{t('Zgjidh Ngjyrën', 'Choose Color')}</div>
                          <div className="grid grid-cols-4 gap-1.5">
                             {TEXT_COLORS.map(c => (
                                <button key={c.id} onClick={() => { updateTextColorMode(c.id); setShowTextColorMenu(false); }} className={`w-7 h-7 rounded-[4px] shadow-sm border-2 ${textColorMode === c.id ? 'border-accent-500 scale-110' : 'border-black/10 hover:scale-110'} transition-transform`} style={{ backgroundColor: c.id === 'default' ? (isDark ? '#52525b' : '#a1a1aa') : c.id }} title={c.name} />
                             ))}
                          </div>
                       </div>
                   </>
                )}
            </div>
            
            <div className="h-4 w-px bg-zinc-500/30 mx-1"></div>

            <button onClick={() => updateSelectedRowsStatus('ok')} className={`p-1.5 rounded transition-colors ${isDark ? "bg-green-600/90 text-white hover:bg-green-500 shadow-sm" : "bg-green-500/90 text-white hover:bg-green-600 shadow-sm"}`} title={t("Në rregull", "Ok")}>
               <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
            <button onClick={() => updateSelectedRowsStatus('blue')} className={`p-1.5 rounded transition-colors ${isDark ? "bg-blue-600/90 text-white hover:bg-blue-500 shadow-sm" : "bg-blue-500/90 text-white hover:bg-blue-600 shadow-sm"}`} title={t("Sekrete / Rëndësi", "Secret / Important")}>
               <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
            <button onClick={() => updateSelectedRowsStatus('x')} className={`p-1.5 rounded transition-colors ${isDark ? "bg-red-600/90 text-white hover:bg-red-500 shadow-sm" : "bg-red-500/90 text-white hover:bg-red-600 shadow-sm"}`} title={t("E Pavlefshme", "Invalid")}>
               <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
            <button onClick={() => updateSelectedRowsStatus('none')} className={`p-1.5 rounded transition-colors ${isDark ? "bg-zinc-700 text-white hover:bg-zinc-600 shadow-sm font-bold" : "bg-zinc-300 text-zinc-900 hover:bg-zinc-400 shadow-sm font-bold"}`} title={t("Hiq Statusin", "Remove Status")}>
               <Unlock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
            
            <div className="relative">
               <button onClick={() => { setShowTagColorMenu(!showTagColorMenu); setShowTextColorMenu(false); setShowTextMenu(false); }} className={`p-1.5 rounded transition-colors ${isDark ? "bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 shadow-sm" : "bg-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-300 shadow-sm"}`} title={t("Ngjyra e Etiketës (Tag)", "Tag Color")}>
                  <Tag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
               </button>
               {showTagColorMenu && (
                   <>
                       <div className="fixed inset-0 z-[140]" onClick={() => setShowTagColorMenu(false)}></div>
                       <div className={`absolute right-0 sm:left-1/2 sm:-translate-x-1/2 top-full mt-2 p-2 rounded-xl border shadow-xl z-[150] flex flex-col gap-1.5 w-[200px] ${isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"}`}>
                           <div className="text-[10px] font-bold uppercase text-zinc-500 px-1 mb-1 border-b border-zinc-500/20 pb-1">{t('Etiketë me Ngjyrë', 'Color Tag')}</div>
                           <div className="grid grid-cols-4 gap-1.5">
                              {TAG_COLORS.map(c => (
                                 <button key={c.id} onClick={() => { updateSelectedRowsStatus(c.id); setShowTagColorMenu(false); }} className={`w-7 h-7 rounded-[4px] shadow-sm border-2 border-black/10 hover:scale-110 transition-transform`} style={{ backgroundColor: c.color }} title={c.name} />
                              ))}
                           </div>
                       </div>
                   </>
               )}
            </div>
            <div className="h-4 w-px bg-zinc-500/30 mx-1"></div>
            <div className="flex items-center gap-1">
                  <span className="text-[10px] text-zinc-500 font-medium tracking-wide uppercase mr-1 hidden sm:inline">{t('Kolonat', 'Cols')}:</span>
                  <button onClick={() => {
                     executeProtectedAction(() => {
                         if(headers.length > 1) {
                             const newH = [...headers];
                             newH.pop();
                             setHeaders(newH);
                             const newW = [...columnWidths];
                             newW.pop();
                             setColumnWidths(newW);
                             updateActiveDocumentState(title, rows, newH, newW);
                         }
                     });
                  }} title={t("Hiq Kolonë", "Remove Column")} className={`p-1.5 rounded transition-colors ${isDark ? "text-zinc-400 hover:text-red-500 hover:bg-red-500/10" : "text-zinc-500 hover:text-red-600 hover:bg-red-50"}`}>
                     <Minus className="w-3.5 h-3.5 border border-current rounded-full" />
                  </button>
                  <span className={`text-[11px] font-bold min-w-[12px] text-center ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>{headers.length}</span>
                  <button onClick={() => {
                     executeProtectedAction(() => {
                         if(headers.length < 8) {
                             const newH = [...headers, `${t('Kolona', 'Col')} ${headers.length + 1}`];
                             setHeaders(newH);
                             const newW = [...columnWidths, 150];
                             setColumnWidths(newW);
                             updateActiveDocumentState(title, rows, newH, newW);
                         }
                     });
                  }} title={t("Shto Kolonë", "Add Column")} className={`p-1.5 rounded transition-colors ${isDark ? "text-zinc-400 hover:text-green-500 hover:bg-green-500/10" : "text-zinc-500 hover:text-green-600 hover:bg-green-50"}`}>
                     <Plus className="w-3.5 h-3.5 border border-current rounded-full" />
                  </button>
                  <div className="h-4 w-px bg-zinc-500/30 mx-1"></div>
                  <button onClick={() => setPreviewSelectedRows(true)} title={t("Shfaq Rrjeshtat e Shenjuar", "View Selected Rows")} className={`p-1.5 rounded transition-colors ${isDark ? "text-zinc-400 hover:text-accent-500 hover:bg-accent-500/10" : "text-zinc-500 hover:text-accent-600 hover:bg-accent-50"}`}>
                     <Eye className="w-4 h-4" />
                  </button>
             </div>
         </div>
        
        <div className="flex flex-wrap gap-1 lg:w-auto lg:min-w-max lg:ml-auto items-center mt-1 lg:mt-0 order-last lg:order-none justify-end">
          <span className={`text-[10px] sm:text-xs font-semibold mr-auto lg:mr-2 tracking-wide flex items-center gap-1.5 px-2 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
             <Calendar className="w-3.5 h-3.5" /> {getAlbanianDateTime()}
          </span>
          <button onClick={() => setAiChatModal(true)} className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] sm:text-xs font-bold rounded transition-colors ${
            isDark ? "bg-accent-600 hover:bg-accent-500 text-white shadow-md border-transparent" : "bg-accent-500 hover:bg-accent-600 text-white shadow-md font-bold border-transparent"
          }`} title={t("Analizo me AI", "Analyze with AI")}>
            <Sparkles className="w-3.5 h-3.5 shrink-0" /> <span className="hidden sm:inline">{t('AI Chat', 'AI Chat')}</span>
          </button>
          
          <button onClick={saveCurrentDocument} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-accent-600 hover:bg-accent-700 text-white text-[11px] sm:text-xs font-bold rounded transition-colors shadow-sm">
            <Save className="w-3.5 h-3.5 shrink-0" /> <span className="hidden sm:inline">{t('Ruaj', 'Save')}</span>
          </button>
          
          {selectedRows.size > 0 ? (
             <button onClick={() => executeProtectedAction(() => setShowConfirmDeleteSelected(true))} className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] sm:text-xs font-bold rounded transition-colors ${
               isDark ? "bg-red-600 hover:bg-red-500 text-white" : "bg-red-500 hover:bg-red-600 text-white"
             }`}>
               <Trash2 className="w-3.5 h-3.5 shrink-0" /> <span>{t('Fshi', 'Delete')} ({selectedRows.size})</span>
             </button>
          ) : (
             <button onClick={() => executeProtectedAction(() => setShowConfirmClear(true))} className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] sm:text-xs font-bold rounded transition-colors border ${
               isDark ? "bg-red-600 hover:bg-red-500 text-white shadow-md border-transparent" : "bg-red-50 bg-red-500/90 text-white hover:bg-red-600 shadow-sm border-red-200"
             }`}>
               <Trash2 className="w-3.5 h-3.5 shrink-0" /> <span className="hidden sm:inline">{t('Bosh', 'Clear')}</span>
             </button>
          )}

          <button onClick={() => setShowConfirmClose(true)} className={`flex items-center gap-1.5 px-4 py-1.5 text-[11px] sm:text-xs font-bold rounded transition-colors ${
              isDark ? "bg-zinc-700 hover:bg-zinc-600 text-white shadow-md font-bold" : "bg-zinc-200 hover:bg-zinc-300 text-zinc-900 shadow-md font-bold border-transparent"
            }`} title={t("Kthehu", "Return")}>
            <LogOut className="w-3.5 h-3.5 shrink-0" /> <span className="hidden sm:inline">{t('Kthehu', 'Return')}</span>
          </button>
        </div>
        
        <div className="flex items-center gap-1.5 min-w-max border-l pl-2 border-zinc-500/30">
                  <div className="relative">
                     <button 
                       onClick={() => setShowThemeMenu(!showThemeMenu)}
                       className={`p-1.5 rounded-full transition-colors ${isDark ? "bg-accent-600 hover:bg-accent-500 text-white shadow-md border-transparent" : "bg-accent-500 hover:bg-accent-600 text-white shadow-md font-bold border-transparent"}`}
                       title="Ndërro Ngjyrën"
                     >
                       <Palette className="w-3.5 h-3.5" />
                     </button>
                     {showThemeMenu && (
                        <div className={`fixed right-4 top-[100px] sm:absolute sm:right-0 sm:top-full mt-2 p-2 rounded-xl border shadow-xl z-[100] flex items-center gap-3 w-[220px] max-w-[calc(100vw-32px)] overflow-x-auto scrollbar-default touch-pan-x ${isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"}`}>
                           {(Object.keys(COLOR_THEMES) as Array<keyof typeof COLOR_THEMES>).map(c => (
                              <button key={c} onClick={() => { setAccentColor(c); setShowThemeMenu(false); }} className="w-8 h-8 shrink-0 rounded-full border-2 border-black/10 transition-transform hover:scale-110 shadow-sm" style={{ backgroundColor: c === 'kontrast' ? '#000000' : COLOR_THEMES[c][500] }} title={c === 'kontrast' ? 'Kontrast i Lartë' : c} />
                           ))}
                        </div>
                     )}
                  </div>
          
          <button 
            onClick={toggleTheme}
            className={`p-1.5 rounded-full transition-colors ${isDark ? "bg-yellow-600 hover:bg-yellow-500 text-white shadow-md border-transparent" : "bg-zinc-800 hover:bg-zinc-700 text-white shadow-md font-bold border-transparent"}`}
          >
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          <div className="flex gap-1">
             <button onClick={exportTxt} className={`flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded transition-colors ${
               isDark ? "bg-zinc-800 hover:bg-zinc-700 text-white shadow-sm border-transparent" : "bg-zinc-200 hover:bg-zinc-300 text-zinc-900 font-bold shadow-sm border-transparent"
             }`} title="Shkarko TXT">
               <File className="w-3.5 h-3.5" /> TXT
             </button>
             <button onClick={exportCsv} className={`flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded transition-colors ${
               isDark ? "bg-zinc-800 hover:bg-zinc-700 text-white shadow-sm border-transparent" : "bg-zinc-200 hover:bg-zinc-300 text-zinc-900 font-bold shadow-sm border-transparent"
             }`} title="Shkarko CSV">
               <FileSpreadsheet className="w-3.5 h-3.5" /> CSV
             </button>
             <button onClick={exportPdf} className={`flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded transition-colors ${
               isDark ? "bg-zinc-800 hover:bg-zinc-700 text-white shadow-sm border-transparent" : "bg-zinc-200 hover:bg-zinc-300 text-zinc-900 font-bold shadow-sm border-transparent"
             }`} title="Shkarko PDF">
               <FileDown className="w-3.5 h-3.5" /> PDF
             </button>
             <button onClick={() => executeProtectedAction(() => setBlueModal(true))} className={`flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded transition-colors ${
               isDark ? "hover:bg-blue-800/30 text-blue-500 hover:text-orange-400" : "hover:bg-blue-50 text-blue-600 hover:text-orange-700"
             }`} title="Shënime Sekrete">
               <Lock className="w-3.5 h-3.5" /> Sekrete
             </button>
             </div>
             

        </div>
      </div>

      {/* HORIZONTAL WRAPPER FOR SWIPING COLUMNS */}
      {/* ADDED overscroll-x-contain touch-pan-x for better mobile swipe UX */}
      <div className={`flex-1 overflow-x-auto overflow-y-auto overscroll-x-contain scrollbar-hide touch-pan-x touch-pan-y ${isDark ? "bg-zinc-950" : "bg-zinc-50"}`}>
        <div className="min-w-[800px] w-full flex flex-col relative">
          
          {/* GRID HEADER */}
          <div className={`flex border-b shadow-sm sticky top-0 z-20 ${isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"}`}>
            <div 
              className={`w-12 shrink-0 border-r flex flex-col items-center justify-center text-xs font-bold sticky left-0 z-30 shadow-[2px_0_5px_rgba(0,0,0,0.05)] transition-colors ${
                isDark ? "bg-zinc-950 border-zinc-800 text-zinc-500" : "bg-white border-zinc-200 text-zinc-500"
              }`}
            >
               
               <div onClick={toggleAllSelection} className={`w-full flex-1 flex items-center justify-center cursor-pointer hover:bg-accent-500/10 ${selectedRows.size > 0 ? "text-accent-500" : ""}`}>
                  {selectedRows.size === rows.length && rows.length > 0 ? <Check className="w-4 h-4" /> : selectedRows.size > 0 ? <Square className="w-4 h-4 text-accent-500" /> : "NR"}
               </div>
            </div>
            {headers.map((h, i) => (
              <div key={i} style={{ width: columnWidths[i] || 150, minWidth: columnWidths[i] || 150, maxWidth: columnWidths[i] || 150 }} className={`shrink-0 border-r py-1 px-1 last:border-r-0 flex flex-col justify-center relative group ${isDark ? "border-zinc-800" : "border-zinc-200"}`}>
                <div className="flex gap-1 justify-between w-full opacity-0 px-1 group-hover:opacity-100 transition-opacity absolute top-0.5 left-0 pointer-events-none">
                   <button onClick={(e) => {
                       e.stopPropagation();
                       executeProtectedAction(() => {
                           const ns = [...columnWidths];
                           ns[i] = Math.max(50, (ns[i] || 150) - 20);
                           setColumnWidths(ns);
                           updateActiveDocumentState(title, rows, headers, ns);
                       });
                   }} className="text-zinc-400 hover:text-zinc-600 font-bold text-[10px] pointer-events-auto">&lt;</button>
                   <button onClick={(e) => {
                       e.stopPropagation();
                       executeProtectedAction(() => {
                           const ns = [...columnWidths];
                           ns[i] = Math.min(600, (ns[i] || 150) + 20);
                           setColumnWidths(ns);
                           updateActiveDocumentState(title, rows, headers, ns);
                       });
                   }} className="text-zinc-400 hover:text-zinc-600 font-bold text-[10px] pointer-events-auto">&gt;</button>
                </div>
                <HeaderInput 
                  initialValue={h}
                  onChange={(val: string) => {
                      const newH = [...headers];
                      newH[i] = val;
                      setHeaders(newH);
                      updateActiveDocumentState(title, rows, newH);
                  }}
                  className={`w-full text-xs bg-transparent text-center font-semibold tracking-wide focus:outline-none focus:text-accent-500 transition-colors ${
                    isDark ? "text-zinc-200 placeholder-zinc-600" : "text-zinc-800 placeholder-zinc-400"
                  }`}
                  placeholder={`Kolona ${i+1}`}
                />
              </div>
            ))}
            <div className={`w-16 shrink-0 border-l flex items-center justify-center text-xs font-bold ${
              isDark ? "bg-zinc-950 border-zinc-800 text-zinc-500" : "bg-white border-zinc-200 text-zinc-500"
            }`}>
              IMG
            </div>
          </div>

          {/* GRID BODY (90 ROWS) */}
          <div className="w-full pb-32">
            {rows.map((r, rIndex) => ({ r, rIndex })).filter(({r}) => {
                if (!docSearch.trim()) return true;
                const q = docSearch.toLowerCase();
                return headers.some((_, c) => (r[`col${c+1}`] || '').toString().toLowerCase().includes(q));
            }).map(({r, rIndex}) => (
                <div key={`${r.id}-${rIndex}`} className={`flex border-b min-h-[28px] group w-full transition-colors ${
                  r.status === 'ok' ? (isDark ? 'bg-green-500/25 border-green-500/40' : 'bg-green-50 border-green-200')
                  : r.status === 'blue' ? (isDark ? 'bg-blue-500/25 border-blue-500/40' : 'bg-blue-50 border-blue-200')
                  : r.status === 'x' ? (isDark ? 'bg-red-500/25 border-red-500/40' : 'bg-red-50 border-red-200')
                  : isDark ? "border-zinc-800/80 focus-within:bg-zinc-900/50" : "border-zinc-200 focus-within:bg-zinc-50"
                }`}>
                  {/* Row Number (Sticky) */}
                  <div 
                    onClick={() => toggleRowSelection(rIndex)}
                    className={`w-12 shrink-0 border-r flex items-center justify-center text-sm font-mono sticky left-0 z-10 transition-all duration-200 cursor-pointer shadow-[2px_0_5px_rgba(0,0,0,0.02)] ${
                      selectedRows.has(rIndex)
                        ? "bg-accent-500 text-white border-r-accent-600"
                        : r.status === 'ok' ? (isDark ? "bg-green-500/20 text-green-400 border-zinc-800" : "bg-green-100 text-green-700 border-zinc-200")
                        : r.status === 'blue' ? (isDark ? "bg-blue-500/20 text-blue-400 border-zinc-800" : "bg-blue-100 text-blue-700 border-zinc-200")
                        : r.status === 'x' ? (isDark ? "bg-red-500/20 text-red-400 border-zinc-800" : "bg-red-100 text-red-700 border-zinc-200")
                        : isDark 
                          ? "bg-zinc-900/50 border-zinc-800 text-zinc-600 group-hover:bg-zinc-900/80 group-hover:text-zinc-400" 
                          : "bg-zinc-50 border-zinc-200 text-zinc-500 group-hover:bg-zinc-100 group-hover:text-zinc-700"
                    }`}
                    style={r.status?.startsWith('tag-') && !selectedRows.has(rIndex) 
                      ? { boxShadow: `inset 4px 0 0 ${TAG_COLORS.find(c => c.id === r.status)?.color || 'transparent'}, 2px 0 5px rgba(0,0,0,0.02)` } 
                      : {}
                    }
                  >
                    {selectedRows.has(rIndex) ? <Check className="w-4 h-4" /> : (rIndex + 1)}
                  </div>

                  {/* 4 Equal Columns */}
                  {headers.map((_, i) => `col${i+1}`).map((colKey, cIndex) => (
                    <div key={cIndex} style={{ width: columnWidths[cIndex] || 150, minWidth: columnWidths[cIndex] || 150, maxWidth: columnWidths[cIndex] || 150 }} className={`shrink-0 border-r relative p-0.5 group/cell ${
                      isDark ? "border-zinc-800" : "border-zinc-200"
                    }`}>
                        <CellInput
                          initialValue={r[colKey as keyof GridRow] as string}
                          onChange={(v: string) => updateCell(rIndex, colKey, v)}
                          readOnly={r.status === 'ok' || r.status === 'blue' || r.status === 'x' || r.status === 'lock'}
                          startHold={() => handleCellHoldStart(rIndex, colKey)}
                          stopHold={handleCellHoldCancel}
                          className={`w-full h-full resize-none focus:outline-none px-1.5 py-0.5 rounded scrollbar-hide leading-[1.3] transition-colors ${
                            r.status === 'x' 
                              ? `line-through decoration-red-500 placeholder-red-500/50 cursor-default bg-transparent ${isDark ? "text-red-100" : "text-red-900"}`
                              : r.status === 'blue'
                                ? `placeholder-blue-500/50 cursor-default bg-transparent ${isDark ? "text-blue-100" : "text-blue-900"}`
                              : r.status === 'ok'
                                ? `placeholder-green-500/50 cursor-default bg-transparent ${isDark ? "text-green-100" : "text-green-900"}`
                                : (isDark ? `${inputBgDark} ${textColorMode === 'default' ? 'text-white' : ''} placeholder-zinc-700/50 focus:border-zinc-700/50` : `${inputBgLight} ${textColorMode === 'default' ? 'text-zinc-900' : ''} placeholder-zinc-400/70 focus:border-zinc-300`)
                          }`}
                          style={{
                               fontSize: `${textSize || 12}px`,
                               fontWeight: textWeight || 400,
                               ...((r.status === 'none' || r.status?.startsWith('tag-')) && textColorMode !== 'default' ? { color: getActualTextColor(textColorMode) } : {}),
                               ...(r.status?.startsWith('tag-') ? { backgroundColor: `${TAG_COLORS.find(c => c.id === r.status)?.color || '#888'}15` } : {})
                          }}
                        />
                        
                        {/* Cell Actions */}
                        <div className={`absolute top-0.5 right-0.5 flex items-center gap-1 transition-opacity z-10 ${
                           listeningCell?.rIndex === rIndex && listeningCell?.colKey === colKey 
                             ? "opacity-100" 
                             : "opacity-0 group-hover/cell:opacity-100"
                        }`}>
                           {r.status !== 'lock' && (
                             <button 
                               onClick={(e) => { e.preventDefault(); toggleVoiceRecording(rIndex, colKey); }}
                               className={`p-1 rounded-md transition-all shadow-md scale-95 hover:scale-100 ${
                                 listeningCell?.rIndex === rIndex && listeningCell?.colKey === colKey 
                                 ? "bg-red-500 text-white animate-pulse opacity-100" // force opacity when listening
                                 : (isDark ? "bg-zinc-700/90 text-zinc-200 hover:bg-zinc-600" : "bg-white/90 text-zinc-600 hover:bg-gray-100 border border-zinc-200")
                               }`}
                               title="Fol për të shkruar"
                             >
                               {listeningCell?.rIndex === rIndex && listeningCell?.colKey === colKey ? <Mic className="w-3 h-3" /> : <MicOff className="w-3 h-3" />}
                             </button>
                           )}
                           <button 
                             onClick={() => openModal(rIndex, colKey)}
                             className={`p-1 rounded-md transition-all shadow-md scale-95 hover:scale-100 ${
                               isDark ? "bg-accent-600/90 text-white hover:bg-accent-500" : "bg-accent-500/90 text-white hover:bg-accent-600"
                             }`}
                             title="Shiko Përmbajtjen e Plotë"
                           >
                             <Maximize2 className="w-3 h-3" />
                           </button>
                        </div>
                    </div>
                  ))}
                  
                  {/* Image Column */}
                  <div className={`w-16 shrink-0 border-l relative p-1 flex items-center justify-center group/img ${
                      isDark ? "border-zinc-800" : "border-zinc-200"
                  }`}>
                     {r.image ? (
                        <div 
                          className={`w-full h-full relative cursor-pointer flex items-center justify-center p-0.5 transition-all ${selectedRows.has(rIndex) ? 'ring-2 ring-blue-500 rounded bg-blue-500/20' : ''}`}
                          onPointerDown={(e) => {
                             isLongPress.current[rIndex] = false;
                             pressTimers.current[rIndex] = setTimeout(() => {
                                 isLongPress.current[rIndex] = true;
                                 setSelectedRows((prev: Set<number>) => {
                                     const n = new Set(prev);
                                     n.add(rIndex);
                                     return n;
                                 });
                                 showToast("Imazhi (Rrjeshti) u zgjodh!");
                             }, 2000);
                          }}
                          onPointerUp={(e) => {
                             if (pressTimers.current[rIndex]) clearTimeout(pressTimers.current[rIndex]);
                             if (!isLongPress.current[rIndex]) {
                                 setPreviewImage(r.image as string);
                             }
                          }}
                          onPointerLeave={(e) => {
                             if (pressTimers.current[rIndex]) clearTimeout(pressTimers.current[rIndex]);
                          }}
                          onPointerCancel={(e) => {
                             if (pressTimers.current[rIndex]) clearTimeout(pressTimers.current[rIndex]);
                          }}
                        >
                           <img src={r.image} className="w-full h-full object-cover rounded opacity-80 hover:opacity-100 transition-opacity ring-1 ring-zinc-500/30" alt="Row upload" />
                           <button onClick={(e) => { e.stopPropagation(); removeImage(rIndex); }} className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover/img:opacity-100 shadow-lg scale-90 hover:scale-110 transition-all">
                               <X className="w-3 h-3" />
                           </button>
                        </div>
                     ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center opacity-30 hover:opacity-100 transition-all rounded gap-1.5 relative group/imgbtn">
                           <label className="cursor-pointer hover:text-accent-500 w-full flex justify-center items-center h-1/2" title="Ngarko imazh (JPG/PNG)">
                             <input type="file" accept="image/png, image/jpeg" className="hidden" onChange={(e) => { if (e.target.files && e.target.files[0]) handleImageUpload(rIndex, e.target.files[0]); }} />
                             <ImagePlus className="w-4 h-4 text-zinc-500" />
                           </label>
                           <button onClick={() => generatePlaceholderImage(rIndex)} className="text-zinc-500 hover:text-teal-500 transition-colors" title="Gjenero Placeholder">
                             <Sparkles className="w-4 h-4" />
                           </button>
                        </div>
                     )}
                  </div>
                </div>
            ))}
            
            {/* NO RESULTS FOR DOC SEARCH */}
            {docSearch.trim() && rows.filter(r => {
                const q = docSearch.toLowerCase();
                return headers.some((_, c) => (r[`col${c+1}`] || '').toString().toLowerCase().includes(q));
            }).length === 0 && (
                <div className={`p-8 text-center text-sm ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>
                   Nuk u gjet asnjë përputhje për "{docSearch}" në këtë dokument.
                </div>
            )}
          </div>

        </div>
      </div>

            {/* PREVIEW SELECTED ROWS MODAL */}
      {previewSelectedRows && (
         <div className="fixed inset-0 z-[250] flex flex-col items-center justify-center bg-black/70 p-4 animate-in zoom-in-95 fill-mode-forwards" onMouseDown={() => setPreviewSelectedRows(false)}>
            <div className={`max-w-3xl w-full p-0 overflow-hidden rounded-2xl shadow-2xl flex flex-col ${isDark ? "bg-zinc-900 border border-zinc-700" : "bg-white border border-zinc-300"}`} onMouseDown={(e) => e.stopPropagation()}>
               <div className={`flex justify-between items-center px-4 py-3 border-b ${isDark ? "border-zinc-800 bg-zinc-950" : "border-zinc-200 bg-zinc-50"}`}>
                  <h3 className={`font-bold flex items-center gap-2 ${isDark ? "text-zinc-200" : "text-zinc-800"}`}>
                      <Eye className="w-5 h-5 text-accent-500" />
                      {t('Rrjeshtat e Shenjuar', 'Selected Rows')} ({selectedRows.size})
                  </h3>
                  <button onClick={() => setPreviewSelectedRows(false)} className="p-1.5 rounded-lg text-zinc-500 hover:text-red-500 transition-colors">
                     <X className="w-5 h-5" />
                  </button>
               </div>
               <div className="p-5 max-h-[75vh] overflow-y-auto w-full">
                  <div className="flex flex-col gap-6">
                      {Array.from(selectedRows as Iterable<number>).sort((a,b) => a-b).filter(rIndex => {
                         const r = rows[rIndex];
                         return headers.some((_, i) => (r[`col${i+1}` as keyof GridRow] as string)?.trim());
                      }).map((rIndex) => {
                         const r = rows[rIndex];
                         return (
                            <div key={rIndex} className={`p-4 rounded-xl border ${isDark ? "bg-zinc-800/50 border-zinc-700" : "bg-zinc-100 border-zinc-300"}`}>
                               <h4 className={`text-sm font-bold mb-3 ${isDark ? 'text-accent-400' : 'text-accent-600'}`}>{t('Rrjeshti', 'Row')} {rIndex + 1}</h4>
                               <div className="flex flex-col gap-3">
                                 {headers.map((h, i) => {
                                     const colVal = r[`col${i+1}` as keyof GridRow] as string;
                                     if (!colVal || !colVal.trim()) return null;
                                     return (
                                        <div key={i} className={`p-3 rounded-lg border ${isDark ? "bg-zinc-900/50 border-zinc-800" : "bg-white border-zinc-200"}`}>
                                           <div className={`text-xs uppercase font-bold mb-1 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>{h}</div>
                                           <div className={`text-sm whitespace-pre-wrap ${isDark ? "text-zinc-200" : "text-zinc-800"}`}>{colVal}</div>
                                        </div>
                                     );
                                 })}
                               </div>
                            </div>
                         );
                      })}
                      {Array.from(selectedRows as Iterable<number>).filter(rIndex => {
                         const r = rows[rIndex];
                         return headers.some((_, i) => (r[`col${i+1}` as keyof GridRow] as string)?.trim());
                      }).length === 0 && (
                         <div className="text-center py-8 text-zinc-500 italic">
                             {selectedRows.size === 0 
                                ? t('Nuk keni shenjuar asnjë rrjesht.', 'You have not selected any rows.') 
                                : t('Rrjeshtat e shenjuar nuk kanë asnjë tekst.', 'Selected rows have no text.')}
                         </div>
                      )}
                  </div>
               </div>
            </div>
         </div>
      )}





            {/* PENDING AI CHANGES MODAL */}
      {pendingAiChanges && (
         <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4 animate-in fade-in">
            <div className={`max-w-xl w-full p-6 rounded-2xl shadow-2xl border ${isDark ? "bg-zinc-900 border-zinc-700" : "bg-white border-zinc-300"}`}>
               <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-accent-500/10 text-accent-500">
                     <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className={`text-xl font-bold ${textColor}`}>{t('Mirato Ndryshimet', 'Approve AI Changes')}</h3>
               </div>
               
               <p className={`mb-4 text-sm ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                  {t('AI sugjeron ndryshime. Struktura e re e kolonave:', 'AI suggests changes. New column structure:')}
               </p>
               
               <div className="flex flex-wrap gap-2 mb-6">
                   {pendingAiChanges.newHeaders.map((h, i) => (
                      <span key={i} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${isDark ? "bg-zinc-800 text-zinc-300" : "bg-zinc-100 text-zinc-700"}`}>
                          {h}
                      </span>
                   ))}
               </div>

               <div className="flex justify-end gap-3">
                  <button onClick={() => setPendingAiChanges(null)} className={`px-4 py-2 font-medium rounded-lg transition-colors ${isDark ? "text-zinc-300 hover:bg-zinc-800" : "text-zinc-600 hover:bg-zinc-100"}`}>
                     {t('Anulo', 'Cancel')}
                  </button>
                  <button onClick={() => {
                        const pd = pendingAiChanges;
                        setPendingAiChanges(null);
                        executeProtectedAction(async () => {
                           const updatedDocs = documents.map(d => {
                               if (d.id === pd.documentId) {
                                   const newRowsWithImages = pd.newRows.map((nr: any, idx: number) => {
                                       return { ...nr, image: d.rows[idx]?.image || null };
                                   });

                                   if (activeDocId === d.id) {
                                      setRows(newRowsWithImages);
                                      setHeaders(pd.newHeaders);
                                      if (pd.newColumnWidths) setColumnWidths(pd.newColumnWidths);
                                      updateActiveDocumentState(title, newRowsWithImages, pd.newHeaders, pd.newColumnWidths);
                                   }
                                   return { ...d, rows: newRowsWithImages, headers: pd.newHeaders, columnWidths: pd.newColumnWidths || d.columnWidths, updatedAt: new Date().toISOString() };
                               }
                               return d;
                           });
                           setDocuments(updatedDocs);
                           localStorage.setItem('grid_notepad_documents_v2', JSON.stringify(updatedDocs));
                           showToast(t("Struktura u përditësua nga AI!", "Structure updated by AI!"));
                           
                           // Try saving to cloud
                           const theDoc = updatedDocs.find((x) => x.id === pd.documentId);
                           if (user && theDoc) setDoc(doc(db, 'documents', theDoc.id), theDoc).catch(()=>console.error('ai header error sync'));
                        });
                  }} className="px-4 py-2 bg-accent-600 hover:bg-accent-500 text-white font-medium rounded-lg transition-colors">
                     {t('Apliko Ndryshimet', 'Apply Changes')}
                  </button>
               </div>
            </div>
         </div>
      )}

      {/* CONFIRMATION MODAL - CLOSE */}
      {showConfirmClose && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in">
            <div className={`max-w-md w-full p-6 rounded-2xl shadow-2xl border ${isDark ? "bg-zinc-900 border-zinc-700" : "bg-white border-zinc-300"}`}>
               <h3 className={`text-xl font-bold mb-3 ${textColor}`}>{t('Kthehu në Katalog', 'Return to Catalog')}</h3>
               <p className={`mb-6 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>{t('A i keni ruajtur ndryshimet tuaja? Nëse dilni pa ruajtur, ndryshimet e fundit nuk do të ruhen.', 'Have you saved your changes? If you exit without saving, recent changes will not be saved.')}</p>
               <div className="flex justify-end gap-3">
                  <button onClick={() => setShowConfirmClose(false)} className={`px-4 py-2 font-medium rounded-lg transition-colors ${isDark ? "text-zinc-300 hover:bg-zinc-800" : "text-zinc-600 hover:bg-zinc-100"}`}>
                     {t('Anulo', 'Cancel')}
                  </button>
                  <button onClick={() => { setShowConfirmClose(false); setActiveDocId(null); }} className="px-4 py-2 bg-accent-600 hover:bg-accent-500 text-white font-medium rounded-lg transition-colors">
                     {t('Kthehu', 'Return')}
                  </button>
               </div>
            </div>
         </div>
      )}

      {showConfirmDeleteSelected && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in">
            <div className={`max-w-md w-full p-6 rounded-2xl shadow-2xl border ${isDark ? "bg-zinc-900 border-zinc-700" : "bg-white border-zinc-300"}`}>
               <h3 className={`text-xl font-bold mb-3 text-red-500`}>Kujdes!</h3>
               <p className={`mb-6 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>Jeni i sigurt që doni të boshatisni {selectedRows.size} rrjeshtat e zgjedhur? Ky veprim nuk mund të kthehet mbrapsht.</p>
               <div className="flex justify-end gap-3">
                  <button onClick={() => setShowConfirmDeleteSelected(false)} className={`px-4 py-2 font-medium rounded-lg transition-colors ${isDark ? "text-zinc-300 hover:bg-zinc-800" : "text-zinc-600 hover:bg-zinc-100"}`}>
                     Anulo
                  </button>
                  <button onClick={handleDeleteSelected} className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg transition-colors">
                     Po, Boshatis
                  </button>
               </div>
            </div>
         </div>
      )}

      {/* CONFIRMATION MODAL - CLEAR */}
      {showConfirmClear && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in">
            <div className={`max-w-md w-full p-6 rounded-2xl shadow-2xl border ${isDark ? "bg-zinc-900 border-zinc-700" : "bg-white border-zinc-300"}`}>
               <h3 className={`text-xl font-bold mb-3 text-red-500`}>Kujdes!</h3>
               <p className={`mb-6 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>Jeni i sigurt që doni të boshatisni të 90 rrjeshtat? Ky veprim nuk mund të kthehet mbrapsht.</p>
               <div className="flex justify-end gap-3">
                  <button onClick={() => setShowConfirmClear(false)} className={`px-4 py-2 font-medium rounded-lg transition-colors ${isDark ? "text-zinc-300 hover:bg-zinc-800" : "text-zinc-600 hover:bg-zinc-100"}`}>
                     Anulo
                  </button>
                  <button onClick={handleClearAll} className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg transition-colors">
                     Po, Boshatis
                  </button>
               </div>
            </div>
         </div>
      )}

      {/* IMAGE PREVIEW MODAL */}
      {previewImage && (
         <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4 animate-in fade-in" onClick={() => setPreviewImage(null)}>
            <div className="relative max-w-5xl w-full h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
               <img src={previewImage} className="max-w-full max-h-full object-contain rounded-lg" alt="Preview Full" />
               <button onClick={() => setPreviewImage(null)} className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black transition-colors">
                  <X className="w-6 h-6" />
               </button>
            </div>
         </div>
      )}

      {/* MODAL FOR EXPANDED TEXT VIEW */}
      {activeCell && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 sm:p-4 animate-in fade-in zoom-in-95">
            <div className={`mx-auto w-full h-[100dvh] sm:max-w-4xl sm:h-[80vh] flex flex-col border-0 sm:border sm:rounded-2xl shadow-2xl overflow-hidden ${
              isDark ? "bg-zinc-900 sm:border-zinc-700" : "bg-white sm:border-zinc-300"
            }`}>
                
                {/* Modal Header */}
                <div className={`flex justify-between items-center p-3 sm:p-4 border-b shrink-0 ${
                  isDark ? "border-zinc-800 bg-zinc-900 text-zinc-200" : "border-zinc-200 bg-zinc-50 text-zinc-800"
                }`}>
                    <h3 className="font-medium text-lg flex items-center gap-2">
                      <span className="text-accent-500 font-bold">Rrjeshti {activeCell.rIndex + 1}</span> 
                      <span className={isDark ? "text-zinc-600" : "text-zinc-400"}>/</span> 
                      <span>{headers[parseInt(activeCell.colKey.replace('col', '')) - 1]}</span>
                      {rows[activeCell.rIndex]?.status === 'lock' && <Lock className="w-4 h-4 ml-2 text-amber-500" />}
                    </h3>
                    <div className="flex items-center gap-2">
                       {rows[activeCell.rIndex]?.status !== 'lock' && (
                         <button onClick={toggleModalVoiceRecording} className={`p-1.5 rounded-lg transition-colors flex items-center gap-1.5 text-sm font-medium ${
                           listeningModal
                           ? "bg-red-500 text-white animate-pulse"
                           : (isDark ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700" : "bg-white border top-1 border-zinc-300 text-zinc-700 hover:bg-zinc-100")
                         }`}>
                           {listeningModal ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                           <span className="hidden sm:inline">{listeningModal ? "Po dëgjon..." : "Përktheni zë në tekst"}</span>
                         </button>
                       )}
                       <button onClick={closeModal} className={`p-1.5 rounded-lg transition-colors ${
                         isDark ? "text-zinc-400 hover:text-white hover:bg-zinc-800" : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200"
                       }`}>
                         <X className="w-5 h-5"/>
                       </button>
                    </div>
                </div>
                
                {/* Modal Body */}
                <div className={`flex-1 p-5 ${isDark ? "bg-zinc-950" : "bg-white"}`}>
                    <textarea
                      autoFocus
                      readOnly={rows[activeCell.rIndex]?.status === 'lock' || rows[activeCell.rIndex]?.status === 'ok' || rows[activeCell.rIndex]?.status === 'blue' || rows[activeCell.rIndex]?.status === 'x'}
                      value={modalText}
                      onChange={(e) => {
                          const val = e.target.value;
                          setModalText(val);
                          updateCell(activeCell.rIndex, activeCell.colKey, val);
                      }}
                      placeholder="Zgjero shënimet e tua dhe shkruaj lirshëm këtu..."
                      className={`w-full h-full bg-transparent resize-none focus:outline-none text-base leading-relaxed scrollbar-hide ${
                        (rows[activeCell.rIndex]?.status === 'lock' || rows[activeCell.rIndex]?.status === 'ok' || rows[activeCell.rIndex]?.status === 'blue' || rows[activeCell.rIndex]?.status === 'x')
                           ? (isDark ? "text-amber-500/90 cursor-default" : "text-amber-600/90 cursor-default")
                           : (isDark ? "text-zinc-200 placeholder-zinc-700" : "text-zinc-800 placeholder-zinc-400")
                      }`}
                      spellCheck={false}
                    />
                </div>
                
                {/* Modal Footer */}
                <div className={`p-3 sm:p-4 border-t flex justify-between items-center shrink-0 ${
                  isDark ? "border-zinc-800 bg-zinc-900" : "border-zinc-200 bg-zinc-50"
                }`}>
                    <span className={`text-xs font-semibold flex items-center gap-1.5 ${isDark ? "text-green-500" : "text-green-600"}`}>
                       {rows[activeCell.rIndex]?.status !== 'lock' && <><Check className="w-3.5 h-3.5" /> Ruhet automatikisht</>}
                    </span>
                    <div className="flex gap-3">
                        <button onClick={closeModal} className={`px-5 py-2.5 rounded-lg font-medium transition-colors ${
                          isDark ? "bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700" : "bg-zinc-200 text-zinc-700 hover:text-zinc-900 hover:bg-zinc-300"
                        }`}>
                          Mbyll
                        </button>
                    </div>
                </div>

            </div>
          </div>
      )}

      {renderSharedModals()}

      {/* TOAST CUSTOM FOR INNER VIEW */}
      {toastMessage && (
         <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-accent-600 text-white px-4 py-2 rounded-lg shadow-lg font-medium text-sm animate-in fade-in slide-in-from-bottom-4 z-[100]">
            {toastMessage}
         </div>
      )}
      {pinOverlayJSX}
    </div>
    </>
  );
}
