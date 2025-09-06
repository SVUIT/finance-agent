# API Routes Integration

Tài liệu này mô tả tất cả các routes backend đã được kết nối với frontend.

## ✅ Backend Routes đã kết nối

### Authentication Routes
- **POST /auth/signup** - Đăng ký tài khoản mới
  - **Frontend**: `AuthContext.signup()`
  - **File**: `src/contexts/AuthContext.tsx`
  - **Status**: ✅ Kết nối hoàn chỉnh

- **POST /auth/login** - Đăng nhập
  - **Frontend**: `AuthContext.login()`
  - **File**: `src/contexts/AuthContext.tsx`
  - **Status**: ✅ Kết nối hoàn chỉnh

- **GET /auth/me** - Lấy thông tin user hiện tại
  - **Frontend**: `AuthContext.refreshUser()`
  - **File**: `src/contexts/AuthContext.tsx`
  - **Status**: ✅ Kết nối hoàn chỉnh

### Main Feature Routes
- **POST /chat** - Chat với AI assistant
  - **Frontend**: `useChat.sendMessage()`
  - **File**: `src/hooks/useChat.ts`
  - **Status**: ✅ Kết nối hoàn chỉnh với retry logic

- **POST /categorize** - Upload và phân loại file CSV
  - **Frontend**: `useChat.uploadFile()`
  - **File**: `src/hooks/useChat.ts`
  - **Status**: ✅ Kết nối hoàn chỉnh

### Settings & Email Routes
- **GET /settings** - Lấy cài đặt người dùng
  - **Frontend**: `Settings.loadSettings()`
  - **File**: `src/components/Settings.tsx`
  - **Status**: ✅ Kết nối hoàn chỉnh

- **PUT /settings** - Cập nhật cài đặt người dùng
  - **Frontend**: `Settings.saveSettings()`
  - **File**: `src/components/Settings.tsx`
  - **Status**: ✅ Kết nối hoàn chỉnh

- **POST /settings/send-test-email** - Gửi email thử nghiệm
  - **Frontend**: `Settings.sendTestEmail()`
  - **File**: `src/components/Settings.tsx`
  - **Status**: ✅ Kết nối hoàn chỉnh

### Health Check Routes
- **POST /health** - Kiểm tra trạng thái server
  - **Frontend**: `useHealthCheck.checkHealth()`
  - **File**: `src/hooks/useHealthCheck.ts`
  - **Status**: ✅ Kết nối hoàn chỉnh

## 🛠️ Utility Functions

### API Request Utilities
- **File**: `src/utils/api.ts`
- **Functions**:
  - `apiRequest()` - Basic API request
  - `apiRequestWithAuth()` - API request with authentication
  - `apiRequestWithRetry()` - API request with retry logic

### Error Handling
- **ErrorBoundary**: `src/components/ErrorBoundary.tsx`
- **ApiError Class**: Custom error class for API errors
- **Retry Logic**: Exponential backoff for failed requests

### Loading States
- **LoadingSpinner**: `src/components/LoadingSpinner.tsx`
- **HealthIndicator**: `src/components/HealthIndicator.tsx`

## 🔄 Data Flow

### Authentication Flow
1. User login/signup → `AuthContext`
2. Token stored in localStorage
3. `refreshUser()` verifies token with `/auth/me`
4. User data updated across components

### Chat Flow
1. User sends message → `useChat.sendMessage()`
2. Message sent to `/chat` with retry logic
3. Response displayed in chat interface
4. File uploads sent to `/categorize`

### Settings Flow
1. Settings loaded from `/settings` on mount
2. User updates settings → `saveSettings()`
3. Settings sent to `/settings` via PUT
4. User data refreshed after successful update

### Health Check Flow
1. Health check runs on app mount
2. Status displayed in `HealthIndicator`
3. Manual refresh available
4. Connection status visible to user

## 🚀 Features Added

### Enhanced Error Handling
- Global error boundary for unhandled errors
- API error classes with proper typing
- Retry logic with exponential backoff
- User-friendly error messages

### Improved User Experience
- Real-time health status indicator
- Loading states for all async operations
- Automatic token verification
- Seamless data synchronization

### Developer Experience
- Centralized API utilities
- Type-safe error handling
- Comprehensive logging
- Development error details

## 📝 Notes

- Tất cả routes đều có error handling
- Authentication được verify tự động
- Retry logic cho các requests quan trọng
- Health check hiển thị trạng thái real-time
- Error boundary bảo vệ toàn bộ ứng dụng
