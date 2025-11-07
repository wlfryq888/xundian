// 巡店记录应用
class StoreVisitApp {
    constructor() {
        this.currentPage = 'main';
        this.currentEditId = null;
        this.records = [];
        this.init();
    }

    // 初始化应用
    init() {
        this.loadRecords();
        this.bindEvents();
        this.renderRecordList();
        this.showDeviceTip();
        this.checkCameraPermissions();
        
        // 检查是否是编辑模式
        const urlParams = new URLSearchParams(window.location.search);
        const editId = urlParams.get('edit');
        if (editId) {
            this.showEditPage(editId);
        }
    }

    // 绑定事件
    bindEvents() {
        // 页面切换按钮
        document.getElementById('addRecordBtn').addEventListener('click', () => {
            this.showEditPage();
        });

        // 返回按钮
        document.getElementById('backBtn').addEventListener('click', () => {
            this.showMainPage();
        });

        document.getElementById('detailBackBtn').addEventListener('click', () => {
            this.showMainPage();
        });

        // 编辑按钮
        document.getElementById('editBtn').addEventListener('click', () => {
            if (this.currentEditId) {
                this.showEditPage(this.currentEditId);
            }
        });

        // 删除按钮
        document.getElementById('deleteBtn').addEventListener('click', () => {
            this.deleteCurrentRecord();
        });

        // 保存按钮
        document.getElementById('saveBtn').addEventListener('click', () => {
            this.saveRecord();
        });

        // 搜索按钮
        document.getElementById('searchBtn').addEventListener('click', () => {
            this.showSearchModal();
        });

        // 关闭搜索
        document.getElementById('closeSearchBtn').addEventListener('click', () => {
            this.hideSearchModal();
        });

        // 搜索输入
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.searchRecords(e.target.value);
        });

        // 图片上传
        document.getElementById('imageInput').addEventListener('change', (e) => {
            this.handleImageUpload(e);
        });

        document.getElementById('cameraInput').addEventListener('change', (e) => {
            this.handleImageUpload(e);
        });

        document.getElementById('galleryInput').addEventListener('change', (e) => {
            this.handleImageUpload(e);
        });

        // 拍照按钮
        document.getElementById('takePhotoBtn').addEventListener('click', () => {
            this.takePhoto();
        });

        // 相册按钮
        document.getElementById('chooseGalleryBtn').addEventListener('click', () => {
            this.chooseFromGallery();
        });
    }

    // 加载记录
    loadRecords() {
        const stored = localStorage.getItem('storeVisitRecords');
        if (stored) {
            this.records = JSON.parse(stored);
        } else {
            this.records = this.getMockData();
            this.saveRecords();
        }
    }

    // 保存记录
    saveRecords() {
        localStorage.setItem('storeVisitRecords', JSON.stringify(this.records));
    }

    // 获取模拟数据
    getMockData() {
        return [
            {
                id: 'rec_001',
                storeId: 'store_001',
                storeName: '星巴克-人民广场店',
                notes: '今日巡店发现：\n1. 门口迎宾热情，咖啡香气扑鼻\n2. 秋冬新品陈列整齐，菜单更新及时\n3. 客流较大，需要增加收银员\n4. 设备运行正常，无故障报告',
                images: ['https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=300&h=300&fit=crop'],
                createdAt: '2024-03-15T10:30:00Z',
                updatedAt: '2024-03-15T10:30:00Z'
            },
            {
                id: 'rec_002',
                storeId: 'store_002',
                storeName: 'ZARA-南京路店',
                notes: '新季服装陈列检查：\n1. 秋季新品已经上架，分类清晰\n2. 模特展示效果良好\n3. 库存整理需要加强，部分尺码不齐全\n4. 顾客试衣间使用情况良好',
                images: [
                    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=300&h=300&fit=crop'
                ],
                createdAt: '2024-03-14T15:45:00Z',
                updatedAt: '2024-03-14T15:45:00Z'
            },
            {
                id: 'rec_003',
                storeId: 'store_003',
                storeName: '优衣库-淮海中路店',
                notes: '月度巡店报告：\n1. 店铺整洁度良好，商品摆放有序\n2. 试衣间干净整洁\n3. 收银台排队时间较短\n4. 建议增加促销活动宣传',
                images: ['https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=300&h=300&fit=crop'],
                createdAt: '2024-03-13T09:20:00Z',
                updatedAt: '2024-03-13T09:20:00Z'
            },
            {
                id: 'rec_004',
                storeId: 'store_004',
                storeName: 'H&M-徐家汇店',
                notes: '新品上市检查：\n1. 新品陈列位置醒目\n2. 价格标签清晰准确\n3. 商品质量检查通过\n4. 店员服务态度良好',
                images: [
                    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=300&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=300&h=300&fit=crop'
                ],
                createdAt: '2024-03-12T14:10:00Z',
                updatedAt: '2024-03-12T14:10:00Z'
            }
        ];
    }

    // 渲染记录列表
    renderRecordList() {
        const listContainer = document.getElementById('recordList');
        
        if (this.records.length === 0) {
            listContainer.innerHTML = `
                <div class="empty-state">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <p>还没有记录</p>
                    <p style="font-size: 14px; margin-top: 4px;">点击下方按钮添加第一条记录</p>
                </div>
            `;
            return;
        }

        listContainer.innerHTML = this.records
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map(record => this.createRecordCard(record))
            .join('');
    }

    // 创建记录卡片
    createRecordCard(record) {
        const time = new Date(record.createdAt).toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const imageHtml = record.images.slice(0, 4).map(image => 
            `<img src="${image}" alt="记录图片" class="record-image" onerror="this.style.display='none'">`
        ).join('');

        return `
            <div class="record-card" onclick="app.showDetailPage('${record.id}')">
                <div class="record-header">
                    <h3 class="store-name">${this.escapeHtml(record.storeName)}</h3>
                    <span class="record-time">${time}</span>
                </div>
                <p class="record-notes">${this.escapeHtml(record.notes)}</p>
                ${record.images.length > 0 ? `
                    <div class="record-images">
                        ${imageHtml}
                    </div>
                ` : ''}
            </div>
        `;
    }

    // 显示主页
    showMainPage() {
        this.currentPage = 'main';
        document.getElementById('mainPage').classList.remove('hidden');
        document.getElementById('editPage').classList.add('hidden');
        document.getElementById('detailPage').classList.add('hidden');
        this.currentEditId = null;
        this.clearEditForm();
    }

    // 显示编辑页面
    showEditPage(recordId = null) {
        this.currentPage = 'edit';
        this.currentEditId = recordId;
        
        document.getElementById('mainPage').classList.add('hidden');
        document.getElementById('editPage').classList.remove('hidden');
        document.getElementById('detailPage').classList.add('hidden');

        if (recordId) {
            // 编辑模式
            const record = this.records.find(r => r.id === recordId);
            if (record) {
                document.getElementById('editPageTitle').textContent = '编辑记录';
                document.getElementById('storeName').value = record.storeName;
                document.getElementById('notes').value = record.notes;
                this.renderEditImages(record.images);
                document.getElementById('deleteBtn').style.display = 'block';
            }
        } else {
            // 新建模式
            document.getElementById('editPageTitle').textContent = '新建记录';
            document.getElementById('storeName').value = '';
            document.getElementById('notes').value = '';
            this.renderEditImages([]);
            document.getElementById('deleteBtn').style.display = 'none';
        }
    }

    // 显示详情页
    showDetailPage(recordId) {
        const record = this.records.find(r => r.id === recordId);
        if (!record) return;

        this.currentPage = 'detail';
        this.currentEditId = recordId;

        document.getElementById('mainPage').classList.add('hidden');
        document.getElementById('editPage').classList.add('hidden');
        document.getElementById('detailPage').classList.remove('hidden');

        const time = new Date(record.createdAt).toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
            hour: '2-digit',
            minute: '2-digit'
        });

        const imageHtml = record.images.map(image => 
            `<img src="${image}" alt="记录图片" class="detail-image" onclick="app.previewImage('${image}')" onerror="this.style.display='none'">`
        ).join('');

        document.getElementById('detailContent').innerHTML = `
            <div class="detail-header">
                <h2 class="detail-title">${this.escapeHtml(record.storeName)}</h2>
                <p class="detail-time">${time}</p>
            </div>
            <div class="detail-text">${this.escapeHtml(record.notes).replace(/\n/g, '<br>')}</div>
            ${record.images.length > 0 ? `
                <div class="detail-images">
                    ${imageHtml}
                </div>
            ` : ''}
        `;
    }

    // 渲染编辑页面的图片
    renderEditImages(images) {
        const imageGrid = document.getElementById('imageGrid');
        const placeholder = document.getElementById('uploadPlaceholder');
        
        if (images.length > 0) {
            placeholder.style.display = 'none';
            imageGrid.innerHTML = images.map((image, index) => `
                <div class="image-item">
                    <img src="${image}" alt="上传图片" onerror="this.style.display='none'">
                    <button type="button" class="image-remove" onclick="app.removeImage(${index})">×</button>
                </div>
            `).join('');
        } else {
            placeholder.style.display = 'flex';
            imageGrid.innerHTML = '';
        }
    }

    // 清理编辑表单
    clearEditForm() {
        document.getElementById('storeName').value = '';
        document.getElementById('notes').value = '';
        this.renderEditImages([]);
    }

    // 删除当前记录
    deleteCurrentRecord() {
        if (!this.currentEditId) return;

        if (confirm('确定要删除这条记录吗？')) {
            this.records = this.records.filter(r => r.id !== this.currentEditId);
            this.saveRecords();
            this.showMainPage();
            this.renderRecordList();
        }
    }

    // 保存记录
    saveRecord() {
        const storeName = document.getElementById('storeName').value.trim();
        const notes = document.getElementById('notes').value.trim();

        if (!storeName) {
            alert('请输入店铺名称');
            return;
        }

        if (!notes) {
            alert('请输入记录内容');
            return;
        }

        const imageGrid = document.getElementById('imageGrid');
        const images = Array.from(imageGrid.querySelectorAll('img')).map(img => img.src);

        const now = new Date().toISOString();

        if (this.currentEditId) {
            // 更新现有记录
            const index = this.records.findIndex(r => r.id === this.currentEditId);
            if (index !== -1) {
                this.records[index] = {
                    ...this.records[index],
                    storeName,
                    notes,
                    images,
                    updatedAt: now
                };
            }
        } else {
            // 创建新记录
            const newRecord = {
                id: 'rec_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                storeId: 'store_' + Date.now(),
                storeName,
                notes,
                images,
                createdAt: now,
                updatedAt: now
            };
            this.records.push(newRecord);
        }

        this.saveRecords();
        this.showMainPage();
        this.renderRecordList();
    }

    // 拍照
    async takePhoto() {
        try {
            // 首先检查权限
            const hasPermission = await this.requestCameraPermission();
            
            if (!hasPermission) {
                alert('需要相机权限才能拍照，请在浏览器设置中允许相机访问');
                return;
            }
            
            const cameraInput = document.getElementById('cameraInput');
            cameraInput.value = ''; // 清除之前的文件
            cameraInput.click();
            
        } catch (error) {
            console.error('拍照失败:', error);
            alert('拍照功能暂时不可用，请从相册选择图片');
            
            // 降级到相册选择
            this.chooseFromGallery();
        }
    }

    // 从相册选择
    chooseFromGallery() {
        const galleryInput = document.getElementById('galleryInput');
        galleryInput.value = ''; // 清除之前的文件
        galleryInput.click();
    }

    // 处理图片上传
    async handleImageUpload(event) {
        const files = Array.from(event.target.files);
        const imageGrid = document.getElementById('imageGrid');

        for (const file of files) {
            if (!file.type.startsWith('image/')) {
                alert('请选择图片文件');
                continue;
            }

            try {
                // 显示加载状态
                this.showImageUploadProgress();
                
                // 压缩图片
                const compressedDataUrl = await this.compressImage(file, 0.8, 800);
                
                // 创建图片元素
                const imageItem = document.createElement('div');
                imageItem.className = 'image-item';
                imageItem.innerHTML = `
                    <img src="${compressedDataUrl}" alt="上传图片" onerror="this.style.display='none'">
                    <button type="button" class="image-remove" onclick="this.parentElement.remove(); app.checkImages()">×</button>
                `;
                
                imageGrid.appendChild(imageItem);
            } catch (error) {
                console.error('图片处理失败:', error);
                alert('图片处理失败，请重试');
            } finally {
                // 隐藏加载状态
                this.hideImageUploadProgress();
            }
        }

        this.checkImages();
        event.target.value = ''; // 清除文件选择
    }

    // 压缩图片
    compressImage(file, quality = 0.8, maxWidth = 800) {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                // 计算新尺寸
                let { width, height } = img;
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;

                // 绘制压缩后的图片
                ctx.drawImage(img, 0, 0, width, height);
                
                // 转换为base64
                const dataUrl = canvas.toDataURL('image/jpeg', quality);
                resolve(dataUrl);
            };

            img.onerror = () => reject(new Error('图片加载失败'));
            
            const reader = new FileReader();
            reader.onload = (e) => {
                img.src = e.target.result;
            };
            reader.onerror = () => reject(new Error('文件读取失败'));
            reader.readAsDataURL(file);
        });
    }

    // 检查图片数量并更新上传区域
    checkImages() {
        const imageGrid = document.getElementById('imageGrid');
        const placeholder = document.getElementById('uploadPlaceholder');
        const images = imageGrid.querySelectorAll('img');
        
        if (images.length > 0) {
            placeholder.style.display = 'none';
        } else {
            placeholder.style.display = 'flex';
        }
    }

    // 删除图片
    removeImage(index) {
        const imageGrid = document.getElementById('imageGrid');
        const images = imageGrid.querySelectorAll('.image-item');
        if (images[index]) {
            images[index].remove();
            this.checkImages();
        }
    }

    // 显示图片上传进度
    showImageUploadProgress() {
        const uploadPlaceholder = document.getElementById('uploadPlaceholder');
        if (uploadPlaceholder && uploadPlaceholder.style.display !== 'none') {
            uploadPlaceholder.innerHTML = `
                <div class="loading-spinner">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="3" opacity="0.3"></circle>
                        <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1m15.5-6.5l-4.24 4.24M6.5 17.5l-4.24 4.24M17.5 17.5l4.24 4.24M6.5 6.5l4.24-4.24"></path>
                    </svg>
                    <span>处理中...</span>
                </div>
            `;
        }
    }

    // 隐藏图片上传进度
    hideImageUploadProgress() {
        const uploadPlaceholder = document.getElementById('uploadPlaceholder');
        if (uploadPlaceholder) {
            uploadPlaceholder.innerHTML = `
                <div class="upload-actions">
                    <button type="button" class="upload-btn" id="takePhotoBtn">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                            <circle cx="12" cy="13" r="4"></circle>
                        </svg>
                        <span>拍照</span>
                    </button>
                    <button type="button" class="upload-btn" id="chooseGalleryBtn">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                            <polyline points="21,15 16,10 5,21"></polyline>
                        </svg>
                        <span>相册</span>
                    </button>
                </div>
            `;
            
            // 重新绑定事件
            document.getElementById('takePhotoBtn').addEventListener('click', () => {
                this.takePhoto();
            });
            
            document.getElementById('chooseGalleryBtn').addEventListener('click', () => {
                this.chooseFromGallery();
            });
        }
    }

    // 检查设备类型并提供最佳体验
    getDeviceType() {
        const userAgent = navigator.userAgent.toLowerCase();
        if (/android/.test(userAgent)) {
            return 'android';
        } else if (/iphone|ipad|ipod/.test(userAgent)) {
            return 'ios';
        }
        return 'desktop';
    }

    // 显示设备特定的提示
    showDeviceTip() {
        const deviceType = this.getDeviceType();
        const hasCamera = navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
        
        if (deviceType === 'desktop' || !hasCamera) {
            console.log('桌面设备或不支持相机访问，将使用文件上传');
        } else {
            console.log('移动设备，将使用相机和相册功能');
        }
    }

    // 显示搜索模态框
    showSearchModal() {
        document.getElementById('searchModal').classList.remove('hidden');
        document.getElementById('searchInput').value = '';
        document.getElementById('searchInput').focus();
        document.getElementById('searchResults').innerHTML = '';
    }

    // 隐藏搜索模态框
    hideSearchModal() {
        document.getElementById('searchModal').classList.add('hidden');
    }

    // 搜索记录
    searchRecords(query) {
        const resultsContainer = document.getElementById('searchResults');
        
        if (!query.trim()) {
            resultsContainer.innerHTML = '';
            return;
        }

        const results = this.records.filter(record => 
            record.storeName.toLowerCase().includes(query.toLowerCase()) ||
            record.notes.toLowerCase().includes(query.toLowerCase())
        );

        if (results.length === 0) {
            resultsContainer.innerHTML = '<p style="text-align: center; color: #6B7280; padding: 16px;">没有找到相关记录</p>';
            return;
        }

        resultsContainer.innerHTML = results.map(record => {
            const time = new Date(record.createdAt).toLocaleDateString('zh-CN');
            const snippet = record.notes.length > 50 
                ? record.notes.substring(0, 50) + '...' 
                : record.notes;
            
            return `
                <div class="search-result-item" onclick="app.showDetailPage('${record.id}'); app.hideSearchModal();">
                    <div class="search-result-title">${this.escapeHtml(record.storeName)}</div>
                    <div class="search-result-snippet">${this.escapeHtml(snippet)}</div>
                    <div style="font-size: 12px; color: #6B7280; margin-top: 2px;">${time}</div>
                </div>
            `;
        }).join('');
    }

    // 预览图片
    previewImage(imageUrl) {
        // 创建全屏图片预览
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            cursor: pointer;
        `;
        
        const img = document.createElement('img');
        img.src = imageUrl;
        img.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
        `;
        
        modal.appendChild(img);
        modal.addEventListener('click', () => document.body.removeChild(modal));
        document.body.appendChild(modal);
    }

    // HTML转义
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 检查相机权限
    async checkCameraPermissions() {
        try {
            if (navigator.permissions) {
                // 检查相机权限
                const cameraPermission = await navigator.permissions.query({ name: 'camera' });
                console.log('相机权限状态:', cameraPermission.state);
                
                // 检查存储权限
                const storagePermission = await navigator.permissions.query({ name: 'persistent-storage' });
                console.log('存储权限状态:', storagePermission.state);
            }
        } catch (error) {
            console.log('权限检查不可用:', error.message);
        }
    }

    // 请求相机权限
    async requestCameraPermission() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    facingMode: 'environment' // 优先使用后置摄像头
                } 
            });
            
            // 立即停止流，我们只是检查权限
            stream.getTracks().forEach(track => track.stop());
            
            return true;
        } catch (error) {
            console.error('相机权限被拒绝:', error.message);
            return false;
        }
    }
}

// 初始化应用
const app = new StoreVisitApp();

// 页面加载完成后的优化
document.addEventListener('DOMContentLoaded', () => {
    // 添加一些触摸优化
    document.body.addEventListener('touchstart', function(){}, true);
    
    // 防止双击缩放
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
    
    // 监听设备方向变化
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 100);
    });
});

// 处理浏览器返回按钮
window.addEventListener('popstate', function(e) {
    if (app.currentPage === 'edit') {
        app.showMainPage();
    } else if (app.currentPage === 'detail') {
        app.showMainPage();
    } else {
        // 退出应用
        if (confirm('确定要退出应用吗？')) {
            window.close();
        }
    }
});

// 防止页面被意外刷新
window.addEventListener('beforeunload', function(e) {
    if (app.currentPage === 'edit') {
        e.preventDefault();
        e.returnValue = '确定要离开吗？未保存的数据将丢失。';
        return e.returnValue;
    }
});