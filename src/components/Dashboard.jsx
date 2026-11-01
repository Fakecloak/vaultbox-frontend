import { useEffect, useState, useRef } from "react";

function Dashboard() {
    const [activeView, setActiveView] = useState('files');

    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [files, setFiles] = useState([]);
    const [folders, setFolders] = useState([]);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);
    const [folderName, setFolderName] = useState('');
    const [selectedFolder, setSelectedFolder] = useState(null);


    const handleUpload = async(file)=> {
        if (!file) return;

        setUploading(true);
        setError('');

        try{
            const token = localStorage.getItem('token');
            const formData = new FormData();

            formData.append('file', file);
            
            if(selectedFolder){
                formData.append('folderId', selectedFolder.id);
            }

            const URL = 'http://localhost:3000/api/files/upload';

            const response = await fetch(URL, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();

            if(!response.ok){
                throw new Error(data.error || 'Failed to upload File');
            }

            await fetchFiles(selectedFolder?.id ?? null);
        } catch(err){
            setError(err.message);
        }finally{
            setUploading(false);
        }
    };

    const handleDownload = async( file ) => {
        try{
            const token = localStorage.getItem('token');

            const URL = `http://localhost:3000/api/files/${file.id}`;

            const response = await fetch(URL, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            });

            if(!response.ok){
                throw new Error('Failed to download file');
            }

            const blob = await response.blob(); //Convert the response into a Blob
            const url = window.URL.createObjectURL(blob); //creates a temporary URL pointing to the Blob in browser memory.

            const link = document.createElement('a'); // Create an anchor element
            link.href = url; // SET THE DOWNLOAD URL
            link.download = file.filename; // Set the filename for download
            document.body.appendChild(link); // Add it to the DOM so it can be clicked
            link.click(); // Simulates a click on the anchor.
            link.remove();  // Remove the anchor

            window.URL.revokeObjectURL(url); //Release the temporary URL
        } catch(err){
            setError(err.message);
        }
    };
    
    const handleDelete = async( fileID ) => {
        const confirmed = window.confirm('Are you sure you want to delete this file?');

        if(!confirmed) return;

        try{
            const token = localStorage.getItem('token');

            const URL = `http://localhost:3000/api/files/${fileID}`;

            const response = await fetch(URL, {
                method: 'DELETE',
                headers:{
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if(!response.ok){
                throw new Error(data.error || 'Failed to delete file');
            }

            await fetchFiles();
        } catch(err){
            setError(err.message);
        }
    };

    const fetchFiles = async (folderId = null) => {
        try{
            const token = localStorage.getItem('token');

            const URL = `http://localhost:3000/api/files${folderId ? `?folderId=${folderId}` : ''}`;

            const response = await fetch(URL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            const data = await response.json();

            if(!response.ok){
                throw new Error(data.error || 'Failed to load files');
            }
            // console.log("API response:", data);
            // console.log("Files:", data.files);  
            setFiles(data.files);
        }catch(err){
            setError(err.message);
        }finally{
            setLoading(false);
        }
    };

    const fetchFolders = async () => {
        try{
            const token = localStorage.getItem('token');

            const URL = 'http://localhost:3000/api/folders';

            const response = await fetch(URL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            const data = await response.json();

            if(!response.ok){
                throw new Error(data.error || 'Failed to load folders');
            }

            setFolders(data.folders);
        } catch(err){
            setError(err.message);
        }
    };

    const handleCreateFolder = async() => {

        if(!folderName || !folderName.trim()) return;

        try{
            const token = localStorage.getItem('token');

            const URL = 'http://localhost:3000/api/folders';

            const response = await fetch(URL, {
                method: 'POST', 
                headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                }, 
                body: JSON.stringify({ name: folderName.trim() }),
            });

            const data = await response.json();

            if(!response.ok){
                throw new Error(data.error || 'Failed to create Folder');
            }

            await fetchFolders();
        
        }catch(err){
            setError(err.message);
        }
    };

    useEffect(()=> {
        fetchFiles();
        fetchFolders();
    }, []);

    return (
        <div className="min-h-screen bg-gray-950 text-white md:flex">
            
            {/* sidebar */}
            <aside className="w-64 shrink-0 border-r border-gray-800 p-5 min-h-screen md:border-b-0 md:border-r">
                <h1 className="text-2xl font-bold text-blue-400">VaultBox</h1>

                <nav className="mt-8 space-y-2">
                    <button className="w-full rounded-lg bg-blue-600 px-4 py-3 text-left font-medium" onClick={() => setActiveView('files') }>My Files</button>
                    <button className="w-full rounded-lg px-4 py-3 text-left text-gray-400 hover:text-white hover:bg-gray-800" onClick={() => setActiveView('folders') }>Folders</button>
                </nav>

                <button className="mt-8 w-full rounded-lg border border-gray-700 px-4 py-3 text-gray-300 hover:bg-gray-800" onClick={ () => {localStorage.removeItem('token'); window.location.href = './login';}}>Log out</button>
            </aside>

            {/* main content */}
            <main className="min-w-0 flex-1 p-5 md:p-8">
                <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold">My Files</h2>
                        <p className="mt-1 text-sm text-gray-400">Manage your Files in one place.</p>
                    </div>

                     

                    <div className=" flex gap-3">
                         <button type="button" onClick={ (e) => fileInputRef.current.click() } disabled={uploading} className="rounded-lg bg-blue-600 px-5 py-2 font-medium hover:bg-blue-500">
                        {uploading ? 'Uploading...' : '+ Upload file'}
                        </button> 
                        <input value={folderName} onChange = {(e)=> setFolderName(e.target.value)} placeholder = "Enter folder name" className="rounded-lg border bg-gray-900 border-gray-700 px-3 py-2" />
                        <button onClick={handleCreateFolder} className="rounded-lg bg-blue-600 px-5 py-2 font-medium hover:bg-blue-500">Create Folder</button>
                    </div>
                </header>
                
                <input ref={fileInputRef} type="file" className="hidden" 
                onChange={ (e) => {
                    handleUpload(e.target.files[0]);
                    e.target.value = ''; 
                } }  
                />

                {/* search  */}
                <div>
                    <input type="search" className="w-full rounded-lg border border-gray-800 bg-gray-900 px-4 py-3 outline-none focus:border-blue-500" placeholder="Search your files..." value={search} onChange={(e)=> setSearch(e.target.value)} />
                </div>

                {/* MyFolder list  */}
                {activeView === 'folders' && (
                    <section className="mt-8 rounded-xl border border-gray-800 bg-gray-900 p-5">
                        <div className="mb-4 flex items-center gap-3">
                        {selectedFolder && (
                            <>
                            <button
                                onClick={() => {
                                setSelectedFolder(null);
                                fetchFiles();
                                }}
                                className="text-blue-400 hover:text-blue-300"
                            >
                                ← Back
                            </button>

                            <h3 className="font-medium">{selectedFolder.name}</h3>
                            </>
                        )}

                        {!selectedFolder && <h3 className="font-medium">My Folders</h3>}
                        </div>

                        {folders.length === 0 ? (
                        <p className="text-sm text-gray-400">No folders yet.</p>
                        ) : (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                            {folders
                            .filter(folder => folder.parentId === (selectedFolder?.id ?? null))
                            .map(folder => (
                                <div
                                key={folder.id}
                                onClick={() => {
                                    setSelectedFolder(folder);
                                    fetchFiles(folder.id);
                                }}
                                className="cursor-pointer rounded-lg border border-gray-800 p-4 hover:border-blue-500 hover:bg-gray-800"
                                >
                                <div className="text-2xl">📁</div>
                                <p className="mt-2 truncate text-sm font-medium">
                                    {folder.name}
                                </p>
                                </div>
                            ))}
                        </div>
                        )}
                    </section>
                    )}

                {/* MyFile list  */}

                {(activeView === 'files' || selectedFolder) && ( 
                    <section className="mt-8 overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
                        <div className="border-b border-gray-800 px-5 py-4">
                            <h3 className="font-medium">Recent files</h3>
                        </div>

                        { loading ? (
                            <p className="p-6 text-gray-400"> Loading files... </p>
                        ): error ? (
                            <p className="p-6 text-red-400">{error}</p>
                        ): files.length === 0 ? (
                            <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
                                <div className="text-4xl">📁</div>

                                <h3 className="mt-4 font-medium"> No files yet </h3>

                                <p className="mt-2 text-sm text-gray-400">Upload your first file to get started.</p>
                            </div>
                            
                        ): (
                            <div className="divide-y divide-gray-800">
                                {files
                                    .filter((file)=>
                                    file.filename.toLowerCase().includes(search.toLowerCase())
                                ).map((file)=>(
                                    <div key={file.id} className="flex items-center justify-between gap-4 p-4">
                                        <div className="min-w-0">
                                            <p className="truncate font-medium">{file.filename}</p>
                                            <p className="text-sm text-gray-400">{(file.size/1024).toFixed(1)}KB</p>
                                        </div> 
                                        
                                        <div className="flex gap-2">
                                        <button onClick= { ()=> handleDownload(file)} className="rounded-lg border border-gray-700 px-3 py-2 text-sm hover:bg-gray-800">Download</button>
                                        <button onClick={() => handleDelete(file.id)} className="rounded-lg border border-red-800 px-3 py-2 text-sm text-red-400 hover:bg-red-950" > Delete </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}    
                    </section>
                )}
            </main>
        </div>
    );
}

export default Dashboard;