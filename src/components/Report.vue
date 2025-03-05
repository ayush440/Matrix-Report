<template>
  <div class="min-h-screen bg-[#151719] text-white p-6 font-['Cabinet_Grotesk']">
    <!-- Error Alert -->
    <div v-if="error" class="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-lg">
      {{ error }}
    </div>

    <div class="max-w-7xl mx-auto mt-10">
      <!-- Navigation and Controls -->
      <div class="flex justify-between items-center mb-6 pb-8 border-b-2 border-[#787878]">
        <h1 class="text-2xl font-bold font-cabinet">
          {{ currentPage === 0 ? 'Make Your own report' : 'Edit Content' }}
        </h1>
        <div class="flex space-x-3">
          <button 
            @click="prevPage" 
            :disabled="currentPage === 0"
            class="px-4 py-2 rounded-lg bg-[#151719] border border-[#787878] hover:bg-gray-700 transition-colors"
            :class="{ 'opacity-50 cursor-not-allowed': currentPage === 0 }"
          >
            Back
          </button>
          <button 
            v-if="currentPage === 0"
            @click="createNewPage" 
            class="px-4 py-2 rounded-lg bg-[#00B852] hover:bg-[#00b853be] transition-colors"
          >
            Next
          </button>
          <button 
            v-else
            @click="addNewPage" 
            class="px-4 py-2 rounded-lg bg-[#00B852] hover:bg-[#00b853be] transition-colors"
          >
            Add Page
          </button>
          <button 
            v-if="currentPage > 0 && contentPages.length > 1"
            @click="deletePage" 
            class="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 transition-colors"
          >
            Delete Page
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Form/Editor Section -->
        <div class="space-y-6 mt-4">
          <!-- Cover Page Form (Page 0) -->
          <div v-if="currentPage === 0">
            <!-- Form Grid with consistent spacing -->
            <div class="grid grid-cols-[200px,1fr] gap-x-4 gap-y-6">
              <label class="self-center">Background Img</label>
              <div 
                class="relative border border-[#787878] rounded-lg p-3 text-center cursor-pointer hover:border-gray-400 transition-colors"
                @click="triggerFileInput('background')"
              >
                <input
                  ref="backgroundInputRef"
                  type="file"
                  class="hidden"
                  accept="image/*"
                  @change="handleBackgroundUpload"
                >
                <span class="flex items-center justify-center text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  {{ coverPage.backgroundImage ? 'Change Image' : 'Choose (max size less than 1 mb)' }}
                </span>
              </div>

              <label class="self-center">Report Title</label>
              <input
                v-model="coverPage.reportTitle"
                type="text"
                class="w-full bg-[#151719] border border-[#787878] rounded-lg p-3 focus:outline-none focus:border-gray-400"
                placeholder="Enter Report Title"
              >

              <label class="self-center">Company Name</label>
              <input
                v-model="coverPage.companyName"
                type="text"
                class="w-full bg-[#151719] border border-[#787878] rounded-lg p-3 focus:outline-none focus:border-gray-400"
                placeholder="Enter Here"
              >

              <label class="self-center">Company Logo</label>
              <div>
                <div 
                  class="relative border border-[#787878] rounded-lg p-3 text-center cursor-pointer hover:border-gray-400 transition-colors"
                  @click="triggerFileInput('logo')"
                >
                  <input
                    ref="logoInputRef"
                    type="file"
                    class="hidden"
                    accept="image/*"
                    @change="handleLogoUpload"
                  >
                  <span class="flex items-center justify-center text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    {{ coverPage.logo ? 'Change Logo' : 'Choose (max size less than 1 mb)' }}
                  </span>
                </div>
                <div v-if="coverPage.logo" class="mt-2 text-sm text-green-500">
                  Logo uploaded successfully
                </div>
              </div>

              <label class="self-center">Issue Date</label>
              <input
                v-model="coverPage.issueDate"
                type="date"
                class="w-full bg-[#151719] border border-[#787878] rounded-lg p-3 focus:outline-none focus:border-gray-400"
              >

              <label class="self-center">Place</label>
              <input
                v-model="coverPage.place"
                type="text"
                class="w-full bg-[#151719] border border-[#787878] rounded-lg p-3 focus:outline-none focus:border-gray-400"
                placeholder="Enter Here"
              >

              <label class="self-center">Report By</label>
              <input
                v-model="coverPage.reportBy"
                type="text"
                class="w-full bg-[#151719] border border-[#787878] rounded-lg p-3 focus:outline-none focus:border-gray-400"
                placeholder="Enter Here"
              >
            </div>
          </div>

          <!-- Content Page Editor (Page > 0) -->
          <div v-else>
            <div class="space-y-6">
              <!-- Logo Upload for Content Pages -->
              <div class="mb-6">
                <label class="block mb-2">Page Logo</label>
                <div 
                  class="relative border border-[#787878] rounded-lg p-3 text-center cursor-pointer hover:border-gray-400 transition-colors"
                  @click="triggerContentPageLogoUpload"
                >
                  <input
                    ref="contentPageLogoInputRef"
                    type="file"
                    class="hidden"
                    accept="image/*"
                    @change="handleContentPageLogoUpload"
                  >
                  <span class="flex items-center justify-center text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    {{ currentContentPage.logo ? 'Change Logo' : 'Choose Logo (max size less than 1 mb)' }}
                  </span>
                </div>
                <div v-if="currentContentPage.logo" class="mt-2 text-sm text-green-500">
                  Logo uploaded successfully
                </div>
              </div>

              <!-- Quill Editor for Content Pages -->
              <div>
                <label class="block mb-2">Page Content</label>
                
                <!-- Quill Editor Container -->
                <div class="quill-container" v-show="quillInitialized">
                  <div ref="quillEditor" class="bg-white rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Page Navigation (only visible when editing content pages) -->
          <div v-if="currentPage > 0 && contentPages.length > 1" class="flex justify-between items-center mt-4">
            <div class="text-sm">
              Page {{ currentPage }} of {{ contentPages.length }}
            </div>
            <div class="space-x-2">
              <button 
                @click="navigateToPage(currentPage - 1)" 
                :disabled="currentPage === 1"
                class="px-3 py-1 rounded-lg bg-transparent border border-[#787878] hover:bg-gray-700 transition-colors"
                :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
              >
                Previous
              </button>
              <button 
                @click="navigateToPage(currentPage + 1)" 
                :disabled="currentPage === contentPages.length"
                class="px-3 py-1 rounded-lg bg-transparent border border-[#787878] hover:bg-gray-700 transition-colors"
                :class="{ 'opacity-50 cursor-not-allowed': currentPage === contentPages.length }"
              >
                Next
              </button>
            </div>
          </div>

          <!-- Download PDF Button -->
          <button 
            @click="generatePDF"
            :disabled="isGeneratingPDF"
            class="w-full mt-6 px-6 py-3 bg-[#00B852] hover:bg-[#00b853be] disabled:bg-[#00B852]/50 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
          >
            {{ isGeneratingPDF ? 'Generating PDF...' : 'Download PDF' }}
          </button>
        </div>

        <!-- Preview Section -->
        <div class="bg-[#151719] rounded-lg p-4">
          <div class="relative">
            <!-- Carousel Preview -->
            <div class="overflow-hidden">
              <div 
                class="flex transition-transform duration-300 ease-in-out"
                :style="{ transform: `translateX(-${currentPreviewPage * 100}%)` }"
              >
                <!-- Cover Page Preview -->
                <div class="flex-shrink-0 w-full">
                  <div 
                    id="report-preview-cover"
                    class="relative bg-gradient-to-b from-gray-800 to-gray-900 w-full shadow-xl mx-auto"
                    style="aspect-ratio: 643/929;"
                  >
                    <!-- Background Image -->
                    <div 
                      v-if="coverPage.backgroundImage"
                      class="absolute inset-0 w-full h-full"
                      :style="{
                        backgroundImage: `url(${coverPage.backgroundImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        opacity: 0.7
                      }"
                    ></div>

                    <!-- Content Overlay -->
                    <div class="relative z-10 h-full flex flex-col">
                      <!-- Logo section with padding -->
                      <div class="p-8">
                        <div class="mb-8 h-16 flex items-center">
                          <img 
                            v-if="coverPage.logo"
                            :src="coverPage.logo"
                            alt="Company Logo" 
                            class="w-[64px] h-[64px] object-contain"
                            
                          />
                          <img 
                            v-else
                            src="../assets/img/matrix-1.png"
                            alt="Default Logo" 
                            class="w-[64px] h-[64px] object-contain"
                        
                          />
                        </div>
                      </div>

                      <!-- Report Title - Centered with flex -->
                      <div class="w-full bg-black/30 flex items-center justify-center py-4 h-20">
                        <h1 class="text-5xl font-bold text-white">{{ coverPage.reportTitle || 'Signal Report' }}</h1>
                      </div>

                      <!-- Rest of the content with padding -->
                      <div class="p-8 flex-1 flex flex-col">
                        <!-- Company Details -->
                        <div class="space-y-4 text-[13px] mt-auto">
                          <div v-if="coverPage.companyName" class="flex flex-col gap-1">
                            <div class="text-gray-400">Company Name:</div>
                            <div class="font-medium text-white">{{ coverPage.companyName }}</div>
                          </div>

                          <div v-if="coverPage.issueDate" class="flex flex-col gap-1">
                            <div class="text-gray-400">Issued Date</div>
                            <div class="font-medium text-white">{{ formatDate(coverPage.issueDate) }}</div>
                          </div>

                          <div v-if="coverPage.place" class="flex flex-col gap-1">
                            <div class="text-gray-400">Place</div>
                            <div class="font-medium text-white">{{ coverPage.place }}</div>
                          </div>

                          <div v-if="coverPage.reportBy" class="flex flex-col gap-1">
                            <div class="text-gray-400">Report By</div>
                            <div class="font-medium text-white">{{ coverPage.reportBy }}</div>
                          </div>
                        </div>

                        <!-- SEBI Watermark -->
                        <div class="mt-8 flex justify-end">
                          <img 
                            src="../assets/img/sebi.png" 
                            alt="SEBI Watermark" 
                            class="w-24 opacity-80"
                            @error="handleWatermarkError" 
                          />
                        </div>

                        <!-- Fixed Paragraph -->
                        <div class="text-[8px] text-gray-400 text-justify">
                          <p>Matrix Trading Tech is a sophisticated algotrading platform, uniquely integrated with TradingView and custom strategies, offering a seamless API connection to your broker. Tailored for retail traders and investors, our platform is dedicated to elevating wealth management practices. While we strive to ensure flawless operation, we recommend consulting a financial advisor before trading or investing through our platform. Please be aware that Matrix Trading Tech cannot be held accountable for any losses resulting from market volatility or any platform-related issues.</p>
                        </div>

                        <!-- Website URL -->
                        <div class="mt-2 text-[8px] text-gray-400 text-center">
                          www.matrixtradingtech.com
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Content Pages Preview -->
                <div 
                  v-for="(page, index) in contentPages" 
                  :key="`content-page-${index}`"
                  class="flex-shrink-0 w-full"
                >
                  <div 
                    :id="`report-preview-page-${index + 1}`"
                    class="relative bg-white w-full shadow-xl mx-auto"
                    style="aspect-ratio: 643/929;"
                  >
                    <div class="relative z-10 h-full flex flex-col">
                      <!-- Logo section with padding -->
                      <div class="p-8">
                        <div class="mb-8 h-16 flex items-center">
                          <img 
                            v-if="page.logo"
                            :src="page.logo"
                            alt="Company Logo" 
                            class="w-[64px] h-[64px] object-contain"
                            @error="handleLogoError"
                          />
                          <img 
                            v-else-if="coverPage.logo"
                            :src="coverPage.logo"
                            alt="Company Logo" 
                            class="w-[64px] h-[64px] object-contain"
                            @error="handleLogoError"
                          />
                          <img 
                            v-else
                            src="../assets/img/matrix-1.png"
                            alt="Default Logo" 
                            class="w-[64px] h-[64px] object-contain"
                            @error="handleLogoError"
                          />
                        </div>
                      </div>

                      <!-- Content Area -->
                      <div class="flex-1 px-8 text-black">
                        <div class="ql-snow">
                          <div class="ql-editor preview-ql-editor" v-html="page.content"></div>
                        </div>
                      </div>

                      <!-- Footer with fixed elements -->
                      <div class="p-8 mt-auto">
                        <!-- SEBI Watermark -->
                        <div class="flex justify-end">
                          <img 
                            src="../assets/img/sebi.png" 
                            alt="SEBI Watermark" 
                            class="w-24 opacity-80"
                            @error="handleWatermarkError" 
                          />
                        </div>

                        <!-- Fixed Paragraph -->
                        <div class="text-[8px] text-gray-400 text-justify">
                          <p>Matrix Trading Tech is a sophisticated algotrading platform, uniquely integrated with TradingView and custom strategies, offering a seamless API connection to your broker. Tailored for retail traders and investors, our platform is dedicated to elevating wealth management practices. While we strive to ensure flawless operation, we recommend consulting a financial advisor before trading or investing through our platform. Please be aware that Matrix Trading Tech cannot be held accountable for any losses resulting from market volatility or any platform-related issues.</p>
                        </div>

                        <!-- Website URL -->
                        <div class="mt-2 text-[8px] text-gray-400 text-center">
                          www.matrixtradingtech.com
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Carousel Navigation -->
            <div class="absolute top-1/2 left-0 right-0 flex justify-between items-center px-4 -mt-6">
              <button 
                @click="prevPreviewPage" 
                :disabled="currentPreviewPage === 0"
                class="bg-gray-800 text-white rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                :class="{ 'opacity-50 cursor-not-allowed': currentPreviewPage === 0 }"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
              <button 
                @click="nextPreviewPage" 
                :disabled="currentPreviewPage === contentPages.length"
                class="bg-gray-800 text-white rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                :class="{ 'opacity-50 cursor-not-allowed': currentPreviewPage === contentPages.length }"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Page indicator -->
          <div class="mt-4 text-center">
            Page {{ currentPreviewPage + 1 }} of {{ contentPages.length + 1 }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'

// Refs for file inputs and editor
const backgroundInputRef = ref(null)
const logoInputRef = ref(null)
const contentPageLogoInputRef = ref(null)
const quillEditor = ref(null)
let quill = null
const quillInitialized = ref(false)

// State management
const error = ref('')
const isGeneratingPDF = ref(false)
const currentPage = ref(0) // 0 = cover page, 1+ = content pages
const currentPreviewPage = ref(0)

// Cover page data
const coverPage = ref({
  backgroundImage: '',
  reportTitle: 'Signal Report', // Default title
  companyName: '',
  logo: '',
  issueDate: '',
  place: '',
  reportBy: '',
  reportDescription: ''
})

// Content pages data
const contentPages = ref([])

// Computed property for current content page to avoid flickering
const currentContentPage = computed(() => {
  if (currentPage.value > 0 && currentPage.value <= contentPages.value.length) {
    return contentPages.value[currentPage.value - 1]
  }
  return { logo: '', content: '<p>Enter your content here...</p>' }
})

// Initialize Quill editor when component mounts
onMounted(() => {
  // Initialize Quill with toolbar options if we're on a content page
  if (currentPage.value > 0) {
    nextTick(() => {
      initQuillEditor()
    })
  }
})

// Clean up Quill instance when component is destroyed
onBeforeUnmount(() => {
  if (quill) {
    // Clean up any event listeners if needed
    quill = null
    quillInitialized.value = false
  }
})

// Watch for page changes to initialize Quill when needed
watch(currentPage, (newValue, oldValue) => {
  if (newValue > 0) {
    // We're on a content page, initialize Quill if not already done
    nextTick(() => {
      if (quillEditor.value && !quill) {
        initQuillEditor()
      } else if (quill && contentPages.value[newValue - 1]) {
        // Update Quill content when switching between content pages
        quill.root.innerHTML = contentPages.value[newValue - 1].content
      }
    })
  }
})

// Initialize Quill editor with necessary modules and formats
const initQuillEditor = () => {
  if (!quillEditor.value) return

  // Define toolbar options
  const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ 'header': 1 }, { 'header': 2 }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],
    [{ 'direction': 'rtl' }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'font': [] }],
    [{ 'align': [] }],
    ['clean'],
    ['link', 'image', 'video']
  ]

  // Initialize Quill
  quill = new Quill(quillEditor.value, {
    modules: {
      toolbar: toolbarOptions
    },
    placeholder: 'Enter your content here...',
    theme: 'snow'
  })

  // Set initial content if available
  if (currentPage.value > 0 && contentPages.value[currentPage.value - 1]) {
    quill.root.innerHTML = contentPages.value[currentPage.value - 1].content
  }

  // Update content on text change
  quill.on('text-change', () => {
    if (currentPage.value > 0) {
      contentPages.value[currentPage.value - 1].content = quill.root.innerHTML
    }
  })

  // Mark Quill as initialized
  quillInitialized.value = true
}

// Page navigation
const prevPage = () => {
  if (currentPage.value > 0) {
    // Save current content if we're on a content page
    if (currentPage.value > 0 && quill) {
      contentPages.value[currentPage.value - 1].content = quill.root.innerHTML
    }
    
    currentPage.value--
    // Update preview to match the current editing page
    currentPreviewPage.value = currentPage.value
  }
}

const createNewPage = () => {
  // Create first content page if none exists
  if (contentPages.value.length === 0) {
    contentPages.value.push({
      logo: '', // Default to using cover page logo
      content: '<p>Enter your content here...</p>'
    })
  }
  currentPage.value = 1 // Move to first content page
  // Update preview to match the current editing page
  currentPreviewPage.value = 1
  
  // Initialize Quill on next tick
  nextTick(() => {
    initQuillEditor()
  })
}

const addNewPage = () => {
  // Save current content before adding a new page
  if (currentPage.value > 0 && quill) {
    contentPages.value[currentPage.value - 1].content = quill.root.innerHTML
  }
  
  contentPages.value.push({
    logo: '', // Default to using cover page logo
    content: '<p>Enter your content here...</p>'
  })
  
  // Navigate to the newly added page
  currentPage.value = contentPages.value.length
  // Update preview to match the current editing page
  currentPreviewPage.value = contentPages.value.length
  
  // Update Quill content on next tick
  nextTick(() => {
    if (quill) {
      quill.root.innerHTML = contentPages.value[currentPage.value - 1].content
    }
  })
}

// Delete the current page
const deletePage = () => {
  if (contentPages.value.length <= 1) {
    error.value = 'Cannot delete the only content page. You need at least one page in your report.'
    return
  }
  
  // Remove the current page
  const pageToDelete = currentPage.value - 1
  contentPages.value.splice(pageToDelete, 1)
  
  // Adjust current page if needed
  if (currentPage.value > contentPages.value.length) {
    currentPage.value = contentPages.value.length
  }
  
  // Adjust preview page if needed
  if (currentPreviewPage.value > contentPages.value.length) {
    currentPreviewPage.value = contentPages.value.length
  }
  
  // Update Quill content on next tick
  nextTick(() => {
    if (quill && currentPage.value > 0) {
      quill.root.innerHTML = contentPages.value[currentPage.value - 1].content
    }
  })
  
  // Show confirmation message
  error.value = ''
}

const navigateToPage = (pageNumber) => {
  // Save current content before navigating
  if (currentPage.value > 0 && quill) {
    contentPages.value[currentPage.value - 1].content = quill.root.innerHTML
  }
  
  if (pageNumber >= 0 && pageNumber <= contentPages.value.length) {
    currentPage.value = pageNumber
    // Update preview to match the current editing page
    currentPreviewPage.value = pageNumber
    
    // Update Quill content on next tick
    nextTick(() => {
      if (quill && currentPage.value > 0) {
        quill.root.innerHTML = contentPages.value[currentPage.value - 1].content
      }
    })
  }
}

// Preview navigation
const prevPreviewPage = () => {
  if (currentPreviewPage.value > 0) {
    currentPreviewPage.value--
  }
}

const nextPreviewPage = () => {
  if (currentPreviewPage.value < contentPages.value.length) {
    currentPreviewPage.value++
  }
}

// Trigger file input click
const triggerFileInput = (type) => {
  if (type === 'background') {
    backgroundInputRef.value?.click()
  } else if (type === 'logo') {
    logoInputRef.value?.click()
  }
}

const triggerContentPageLogoUpload = () => {
  contentPageLogoInputRef.value?.click()
}

// Enhanced file upload handling with image validation
const handleFileUpload = (file, maxSize = 1024 * 1024) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file selected'))
      return
    }

    if (file.size > maxSize) {
      reject(new Error('File size must be less than 1MB'))
      return
    }

    if (!file.type.startsWith('image/')) {
      reject(new Error('File must be an image'))
      return
    }

    const reader = new FileReader()
    
    reader.onload = (e) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      
      img.onload = () => {
        // Additional image validation if needed
        if (img.width === 0 || img.height === 0) {
          reject(new Error('Invalid image file'))
          return
        }
        resolve(e.target.result)
      }
      
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = e.target.result
    }
    
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

const handleBackgroundUpload = async (event) => {
  try {
    error.value = ''
    const file = event.target.files[0]
    coverPage.value.backgroundImage = await handleFileUpload(file)
  } catch (err) {
    error.value = err.message
    coverPage.value.backgroundImage = ''
  }
}

const handleLogoUpload = async (event) => {
  try {
    error.value = ''
    const file = event.target.files[0]
    coverPage.value.logo = await handleFileUpload(file)
  } catch (err) {
    error.value = err.message
    coverPage.value.logo = ''
  }
}

const handleContentPageLogoUpload = async (event) => {
  try {
    error.value = ''
    const file = event.target.files[0]
    if (currentPage.value > 0) {
      contentPages.value[currentPage.value - 1].logo = await handleFileUpload(file)
    }
  } catch (err) {
    error.value = err.message
    if (currentPage.value > 0) {
      contentPages.value[currentPage.value - 1].logo = ''
    }
  }
}


const handleWatermarkError = (event) => {
  event.target.style.display = 'none' // Hide if can't load
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

// Enhanced PDF generation with multi-page support
const generatePDF = async () => {
  try {
    error.value = ''
    isGeneratingPDF.value = true
    
    // Save current content if we're on a content page
    if (currentPage.value > 0 && quill) {
      contentPages.value[currentPage.value - 1].content = quill.root.innerHTML
    }
    
    // Create a new PDF document
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })
    
    // Process cover page
    const coverPageElement = document.getElementById('report-preview-cover')
    if (!coverPageElement) {
      throw new Error('Cover page element not found')
    }
    
    // Wait for all images to load on cover page
    const coverPageImages = coverPageElement.getElementsByTagName('img')
    await Promise.all(
      Array.from(coverPageImages).map(
        img => new Promise((resolve) => {
          if (img.complete) resolve()
          else {
            img.onload = resolve
            img.onerror = () => {
              error.value = `Failed to load image: ${img.alt}`
              resolve()
            }
          }
        })
      )
    )
    
    // Generate canvas for cover page
    const coverPageCanvas = await html2canvas(coverPageElement, {
      scale: 10,
      useCORS: true,
      logging: false,
      allowTaint: true,
      backgroundColor: '#ffffff',
      imageTimeout: 15000,
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.getElementById('report-preview-cover')
        if (clonedElement) {
          // Set exact dimensions
          clonedElement.style.width = `${coverPageElement.offsetWidth}px`
          clonedElement.style.height = `${coverPageElement.offsetHeight}px`
          
          // Adjust logo size for PDF
          const logo = clonedElement.querySelector('img[alt="Company Logo"]')
          if (logo) {
            logo.style.width = '64px'
            logo.style.height = 'auto'
          }
        }
      }
    })
    
    // Add cover page to PDF
    const coverPageImgData = coverPageCanvas.toDataURL('image/jpeg', 1.0)
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    
    pdf.addImage(coverPageImgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST')
    
    // Process content pages
    for (let i = 0; i < contentPages.value.length; i++) {
      // Add a new page to the PDF
      pdf.addPage()
      
      const pageElement = document.getElementById(`report-preview-page-${i + 1}`)
      if (!pageElement) {
        throw new Error(`Content page ${i + 1} element not found`)
      }
      
      // Wait for all images to load on this page
      const pageImages = pageElement.getElementsByTagName('img')
      await Promise.all(
        Array.from(pageImages).map(
          img => new Promise((resolve) => {
            if (img.complete) resolve()
            else {
              img.onload = resolve
              img.onerror = () => {
                error.value = `Failed to load image: ${img.alt}`
                resolve()
              }
            }
          })
        )
      )
      
      // Generate canvas for this page
      const pageCanvas = await html2canvas(pageElement, {
        scale: 10,
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: '#ffffff',
        imageTimeout: 15000,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById(`report-preview-page-${i + 1}`)
          if (clonedElement) {
            // Set exact dimensions
            clonedElement.style.width = `${pageElement.offsetWidth}px`
            clonedElement.style.height = `${pageElement.offsetHeight}px`
            
            // Adjust logo size for PDF
            const logo = clonedElement.querySelector('img[alt="Company Logo"]')
            if (logo) {
              logo.style.width = '64px'
              logo.style.height = 'auto'
            }
          }
        }
      })
      
      // Add this page to PDF
      const pageImgData = pageCanvas.toDataURL('image/jpeg', 1.0)
      pdf.addImage(pageImgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST')
    }
    
    // Save the complete PDF with all pages
    pdf.save(`${coverPage.value.reportTitle || 'report'}.pdf`)
  } catch (err) {
    error.value = 'Error generating PDF: ' + err.message
  } finally {
    isGeneratingPDF.value = false
  }
}
</script>


<style>
@import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;600;700&display=swap');

input[type="date"] {
  color-scheme: dark;
}

#report-preview-cover,
[id^="report-preview-page-"] {
  transform: none !important; /* Removes any unwanted transformations */
  direction: ltr; /* Ensures text is left-to-right */
  unicode-bidi: normal; /* Resets potential text direction issues */
  will-change: transform; /* Improves performance for animations */
  backface-visibility: hidden; /* Prevents flickering */
}

/* Quill Editor Styles */
.quill-container {
  border-radius: 8px;
  overflow: hidden;
  min-height: 250px; /* Ensure minimum height even before initialization */
}

.quill-container .ql-toolbar {
  background-color: #f0f0f0;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-color: #ddd;
  position: sticky;
  top: 0;
  z-index: 10;
}

.quill-container .ql-container {
  min-height: 200px;
  max-height: 400px;
  overflow-y: auto;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  border-color: #ddd;
  background-color: white;
}

.quill-container .ql-editor {
  min-height: 200px;
  font-size: 14px;
  line-height: 1.5;
  color: #333;
}

/* Preview Quill Styles */
.preview-ql-editor {
  padding: 0 !important; 
  font-size: 12px;
}

.preview-ql-editor img {
  max-width: 100%;
  height: auto; 
}
</style>
