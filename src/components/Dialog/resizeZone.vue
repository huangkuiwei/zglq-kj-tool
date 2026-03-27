<template>
    <div class="resize-diy-container">
        <!-- 左侧列表容器 -->
        <div class="aside" :style="{ width: leftWidth + 'px' }" @scroll="handleScroll">
            <slot name="left"></slot>
        </div>

        <!-- 拖拽条 -->
        <div class="resize-content-div" @mousedown="startResize" @touchstart.passive="startResize"></div>

        <!-- 右侧内容区域 -->
        <div class="itemContent" :style="{ width: `calc(100% - ${leftWidth + 12}px)` }">
            <div class="right-content" :style="isResizing? { 'left': '-2000px' } : {}">
                <slot name="right"></slot>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'ResizeZone',
    props: {
        // 初始左侧宽度，支持百分比和数值
        initLeftWidth: {
            type: [String, Number],
            default: 330
        },
        // 左侧最小宽度
        leftMinWidth: {
            type: Number,
            default: 200
        },
        // 右侧最小宽度
        rightMinWidth: {
            type: Number,
            default: 200
        }
    },
    data() {
        return {
            leftWidth: 330, // 初始宽度与原有样式一致
            isResizing: false,
            // 添加用于优化的变量
            resizeRAF: null
        }
    },
    mounted() {
        this.initWidth()
        // 监听窗口大小变化，重新计算宽度
        window.addEventListener('resize', this.handleWindowResize)
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.handleWindowResize)
        // 清理可能存在的动画帧
        if (this.resizeRAF) {
            cancelAnimationFrame(this.resizeRAF)
        }
    },
    methods: {
        initWidth() {
            const containerWidth = this.$el?.getBoundingClientRect().width || window.innerWidth

            if (typeof this.initLeftWidth === 'string' && this.initLeftWidth.includes('%')) {
                // 处理百分比
                const percentage = parseFloat(this.initLeftWidth) / 100
                this.leftWidth = Math.max(this.leftMinWidth, Math.min(containerWidth - this.rightMinWidth, containerWidth * percentage))
            } else if (typeof this.initLeftWidth === 'number') {
                // 处理数值
                this.leftWidth = Math.max(this.leftMinWidth, Math.min(containerWidth - this.rightMinWidth, this.initLeftWidth))
            } else {
                // 默认值
                this.leftWidth = 330
            }
        },
        handleWindowResize() {
            this.initWidth()
        },
        handleScroll(e) {
            // 保持原有滚动事件处理
            this.$emit('scroll', e)
        },
        startResize(e) {
            e.preventDefault();
            this.isResizing = true
            // 添加全局拖拽样式
            document.body.classList.add('resizing-drag')
            document.addEventListener('mousemove', this.handleResize)
            document.addEventListener('mouseup', this.stopResize)
            document.addEventListener('touchmove', this.handleResize)
            document.addEventListener('touchend', this.stopResize)
        },
        handleResize(e) {
            e.preventDefault();
            if (!this.isResizing) return
            
            // 使用 requestAnimationFrame 优化性能
            if (this.resizeRAF) {
                cancelAnimationFrame(this.resizeRAF)
            }
            
            this.resizeRAF = requestAnimationFrame(() => {
                const containerRect = this.$el.getBoundingClientRect()
                let clientX;
                
                if (e.type === 'touchmove') {
                    clientX = e.touches[0].clientX || 0
                } else {
                    clientX = e.clientX || 0
                }
                
                const newWidth = clientX - containerRect.left

                // 根据左右最小宽度限制计算实际宽度
                const containerWidth = containerRect.width
                const maxLeftWidth = containerWidth - this.rightMinWidth

                this.leftWidth = Math.max(this.leftMinWidth, Math.min(maxLeftWidth, newWidth))

                // 触发宽度变化事件
                this.$emit('resize', {
                    leftWidth: this.leftWidth,
                    rightWidth: containerWidth - this.leftWidth
                })
            })
        },
        stopResize() {
            this.isResizing = false
            // 移除全局拖拽样式
            document.body.classList.remove('resizing-drag')
            document.removeEventListener('mousemove', this.handleResize)
            document.removeEventListener('mouseup', this.stopResize)
            document.removeEventListener('touchmove', this.handleResize)
            document.removeEventListener('touchend', this.stopResize)
            
            // 清理动画帧
            if (this.resizeRAF) {
                cancelAnimationFrame(this.resizeRAF)
                this.resizeRAF = null
            }

            // 触发调整结束事件
            this.$emit('resizeEnd', {
                leftWidth: this.leftWidth
            })
        }
    }
}
</script>

<style scoped lang="scss">
// 全局拖拽样式
body.resizing-drag {
    cursor: col-resize !important;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
}

.resize-diy-container {
    position: relative;
    display: flex;
    height: 100%;
    width: 100%;

    .aside {
        height: 100%;
        overflow: auto;
        position: relative;
        // 拖拽时移除过渡动画以提高性能
        transition: width 0.1s ease;
    }

    .itemContent {
        height: 100%;
        overflow: auto;
        margin-left: 8px;
        position: relative;
        // 拖拽时移除过渡动画以提高性能
        transition: width 0.1s ease;
    }

    .right-content {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
    }

    .resize-content-div {
        width: 6px;
        height: 100%;
        background: #c2d4ff;
        cursor: col-resize;
        z-index: 1000;
        transition: background-color 0.2s;
        position: relative;
        margin-left: 6px;

        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: -4px;
            width: 14px;
            height: 100%;
            cursor: col-resize;
            z-index: 999;
        }

        &:hover,
        &:active {
            background: #409EFF;
        }
    }
    
    // 拖拽时移除过渡动画以提高性能
    .aside,
    .itemContent {
        transition: none;
    }
}

// 拖拽时移除过渡动画以提高性能
body.resizing-drag .resize-diy-container .aside,
body.resizing-drag .resize-diy-container .itemContent {
    transition: none !important;
}
</style>