import React, { useState, useMemo } from 'react'
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd'
import {
    Eye,
    Clock,
    Heart,
    CheckCircle,
    Filter,
    Search,
    Download,
    Upload,
    Grid,
    List,
    Settings
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { WatchlistItem } from './WatchlistItem'
import { WatchlistStats } from './WatchlistStats'
import { EmptyState } from '@/components/common/EmptyState'
import { useWatchlistStore } from '@/store'
import { cn } from '@/utils/helpers'
import type { WatchlistItem as WatchlistItemType } from '@/types/user'

type ViewMode = 'grid' | 'list'
type CategoryKey = 'to-watch' | 'watching' | 'watched' | 'favorites'

interface CategoryConfig {
    key: CategoryKey
    title: string
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
    color: string
    description: string
}

const CATEGORIES: CategoryConfig[] = [
    {
        key: 'to-watch',
        title: 'To Watch',
        icon: Clock,
        color: 'text-blue-600',
        description: 'Movies you plan to watch',
    },
    {
        key: 'watching',
        title: 'Currently Watching',
        icon: Eye,
        color: 'text-green-600',
        description: 'Movies you are currently watching',
    },
    {
        key: 'watched',
        title: 'Watched',
        icon: CheckCircle,
        color: 'text-purple-600',
        description: 'Movies you have completed',
    },
    {
        key: 'favorites',
        title: 'Favorites',
        icon: Heart,
        color: 'text-red-600',
        description: 'Your favorite movies',
    },
]

export const WatchlistContainer: React.FC = () => {
    const [activeTab, setActiveTab] = useState<CategoryKey>('to-watch')
    const [viewMode, setViewMode] = useState<ViewMode>('grid')
    const [searchQuery, setSearchQuery] = useState('')
    const [showFilters, setShowFilters] = useState(false)
    const [showStats, setShowStats] = useState(false)
    const [showImportModal, setShowImportModal] = useState(false)
    const [importData, setImportData] = useState('')
    const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set())
    const [bulkAction, setBulkAction] = useState<string>('')

    const {
        categories,
        moveToCategory,
        removeFromWatchlist,
        exportWatchlist,
        importWatchlist,
    } = useWatchlistStore()

    // Filter items based on search query
    const filteredItems = useMemo(() => {
        const categoryItems = categories[activeTab] || []

        if (!searchQuery.trim()) {
            return categoryItems
        }

        return categoryItems.filter((item: WatchlistItemType) =>
            item.movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.personalNotes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.tags?.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        )
    }, [categories, activeTab, searchQuery])

    // Handle drag and drop
    const handleDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result

        if (!destination) return

        const movieId = parseInt(draggableId)
        const newCategory = destination.droppableId as CategoryKey

        if (source.droppableId !== destination.droppableId) {
            moveToCategory(movieId, newCategory)
        }
    }

    // Handle bulk actions
    const handleBulkAction = () => {
        if (bulkAction === 'delete') {
            selectedItems.forEach(movieId => {
                removeFromWatchlist(movieId)
            })
            setSelectedItems(new Set())
        } else if (bulkAction && bulkAction !== 'delete') {
            selectedItems.forEach(movieId => {
                moveToCategory(movieId, bulkAction as CategoryKey)
            })
            setSelectedItems(new Set())
        }
        setBulkAction('')
    }

    // Handle item selection
    const toggleItemSelection = (movieId: number) => {
        const newSelected = new Set(selectedItems)
        if (newSelected.has(movieId)) {
            newSelected.delete(movieId)
        } else {
            newSelected.add(movieId)
        }
        setSelectedItems(newSelected)
    }

    // Handle export
    const handleExport = () => {
        const data = exportWatchlist()
        const blob = new Blob([data], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `moviemind-watchlist-${new Date().toISOString().split('T')[0]}.json`
        a.click()
        URL.revokeObjectURL(url)
    }

    // Handle import
    const handleImport = () => {
        if (importData.trim()) {
            importWatchlist(importData)
            setImportData('')
            setShowImportModal(false)
        }
    }

    const currentCategory = CATEGORIES.find(cat => cat.key === activeTab)
    const Icon = currentCategory?.icon || Clock

    return (
        <div className="container-custom py-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            My Watchlist
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Manage your movie collection and track your viewing progress
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowStats(true)}
                        leftIcon={<Settings className="w-4 h-4" />}
                    >
                        Statistics
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleExport}
                        leftIcon={<Download className="w-4 h-4" />}
                    >
                        Export
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowImportModal(true)}
                        leftIcon={<Upload className="w-4 h-4" />}
                    >
                        Import
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {CATEGORIES.map((category) => {
                    const CategoryIcon = category.icon
                    const count = categories[category.key]?.length || 0
                    const isActive = activeTab === category.key

                    return (
                        <Card
                            key={category.key}
                            hover
                            className={cn(
                                'cursor-pointer transition-all duration-200',
                                isActive ? 'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900/20' : ''
                            )}
                            onClick={() => setActiveTab(category.key)}
                        >
                            <div className="flex items-center space-x-3">
                                <div className={cn('p-2 rounded-lg bg-gray-100 dark:bg-gray-700', category.color)}>
                                    <CategoryIcon className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                        {category.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {count} {count === 1 ? 'movie' : 'movies'}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    )
                })}
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                {/* Search */}
                <div className="flex-1">
                    <Input
                        placeholder="Search movies, notes, or tags..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        leftIcon={<Search className="w-4 h-4" />}
                    />
                </div>

                {/* View Controls */}
                <div className="flex items-center space-x-2">
                    {/* Bulk Actions */}
                    {selectedItems.size > 0 && (
                        <>
                            <select
                                value={bulkAction}
                                onChange={(e) => setBulkAction(e.target.value)}
                                className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800"
                            >
                                <option value="">Move selected to...</option>
                                {CATEGORIES.filter(cat => cat.key !== activeTab).map(cat => (
                                    <option key={cat.key} value={cat.key}>{cat.title}</option>
                                ))}
                                <option value="delete">Delete</option>
                            </select>

                            <Button
                                variant="primary"
                                size="sm"
                                onClick={handleBulkAction}
                                disabled={!bulkAction}
                            >
                                Apply ({selectedItems.size})
                            </Button>
                        </>
                    )}

                    {/* View Mode Toggle */}
                    <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={cn(
                                'p-2 rounded transition-colors',
                                viewMode === 'grid'
                                    ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            )}
                        >
                            <Grid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={cn(
                                'p-2 rounded transition-colors',
                                viewMode === 'list'
                                    ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            )}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowFilters(!showFilters)}
                        leftIcon={<Filter className="w-4 h-4" />}
                    >
                        Filters
                    </Button>
                </div>
            </div>

            {/* Active Category Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <Icon className={cn('w-6 h-6', currentCategory?.color)} />
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {currentCategory?.title}
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {currentCategory?.description}
                        </p>
                    </div>
                </div>

                <Badge variant="default" size="lg">
                    {filteredItems.length} {filteredItems.length === 1 ? 'movie' : 'movies'}
                </Badge>
            </div>

            {/* Content */}
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId={activeTab} direction={viewMode === 'grid' ? 'horizontal' : 'vertical'}>
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={cn(
                                'min-h-[400px] rounded-lg border-2 border-dashed transition-colors',
                                snapshot.isDraggingOver
                                    ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20'
                                    : 'border-gray-200 dark:border-gray-700'
                            )}
                        >
                            {filteredItems.length === 0 ? (
                                <EmptyState
                                    type="watchlist"
                                    title={searchQuery ? 'No movies found' : `Your ${currentCategory?.title.toLowerCase()} list is empty`}
                                    description={
                                        searchQuery
                                            ? 'Try adjusting your search terms'
                                            : `Start adding movies to your ${currentCategory?.title.toLowerCase()} list`
                                    }
                                    actionLabel={searchQuery ? 'Clear search' : 'Discover movies'}
                                    onAction={() => searchQuery ? setSearchQuery('') : window.location.href = '/'}
                                />
                            ) : (
                                <div className={cn(
                                    'p-4',
                                    viewMode === 'grid'
                                        ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'
                                        : 'space-y-3'
                                )}>
                                    {filteredItems.map((item: WatchlistItemType, index: number) => (
                                        <WatchlistItem
                                            key={item.id}
                                            item={item}
                                            index={index}
                                            viewMode={viewMode}
                                            isSelected={selectedItems.has(item.id)}
                                            onToggleSelect={() => toggleItemSelection(item.id)}
                                            category={activeTab}
                                        />
                                    ))}
                                </div>
                            )}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            {/* Statistics Modal */}
            <Modal
                isOpen={showStats}
                onClose={() => setShowStats(false)}
                title="Watchlist Statistics"
                size="xl"
            >
                <WatchlistStats />
            </Modal>

            {/* Import Modal */}
            <Modal
                isOpen={showImportModal}
                onClose={() => setShowImportModal(false)}
                title="Import Watchlist"
                size="lg"
            >
                <div className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-400">
                        Paste your exported watchlist JSON data below:
                    </p>

                    <textarea
                        value={importData}
                        onChange={(e) => setImportData(e.target.value)}
                        placeholder="Paste JSON data here..."
                        className="w-full h-40 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />

                    <div className="flex items-center justify-end space-x-3">
                        <Button
                            variant="outline"
                            onClick={() => setShowImportModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleImport}
                            disabled={!importData.trim()}
                        >
                            Import
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
