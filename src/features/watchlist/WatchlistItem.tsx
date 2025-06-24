// ===== src/features/watchlist/WatchlistItem.tsx =====
import React, { useState } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import {
    Star,
    Clock,
    MoreVertical,
    Edit3,
    Trash2,
    CheckCircle,
    Eye,
    Heart,
    Tag,
    ArrowUpCircle,
    ArrowDownCircle,
    MinusCircle
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Rating } from '@/components/common/Rating'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { useWatchlistStore } from '@/store'
import { tmdbService } from '@/services/tmdb'
import { formatDate, getYear } from '@/utils/helpers'
import { cn } from '@/utils/helpers'
import type { WatchlistItem as WatchlistItemType } from '@/types/movie'

interface WatchlistItemProps {
    item: WatchlistItemType
    index: number
    viewMode: 'grid' | 'list'
    isSelected: boolean
    onToggleSelect: () => void
    category: string
}

type Priority = 'high' | 'medium' | 'low'

export const WatchlistItem: React.FC<WatchlistItemProps> = ({
    item,
    index,
    viewMode,
    isSelected,
    onToggleSelect,
    category,
}) => {
    const navigate = useNavigate()
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showDropdown, setShowDropdown] = useState(false)

    // Local state for editing
    const [editingRating, setEditingRating] = useState(item.personalRating || 0)
    const [editingNotes, setEditingNotes] = useState(item.personalNotes || '')
    const [editingPriority, setEditingPriority] = useState<Priority>(item.priority || 'medium')
    const [editingTags, setEditingTags] = useState(item.tags?.join(', ') || '')
    const [editingWatchedDate, setEditingWatchedDate] = useState(
        item.watchedAt ? new Date(item.watchedAt).toISOString().split('T')[0] : ''
    )

    const {
        removeFromWatchlist,
        updateWatchlistItem,
        markAsWatched,
        moveToCategory,
    } = useWatchlistStore()

    const posterUrl = tmdbService.getImageURL(item.movie.poster_path, 'MEDIUM')
    const year = getYear(item.movie.release_date)

    const handleEdit = () => {
        setShowEditModal(true)
        setShowDropdown(false)
    }

    const handleSaveEdit = () => {
        const tags = editingTags
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0)

        updateWatchlistItem(item.id, {
            personalRating: editingRating > 0 ? editingRating : undefined,
            personalNotes: editingNotes.trim(),
            priority: editingPriority,
            tags,
            watchedAt: editingWatchedDate ? new Date(editingWatchedDate).toISOString() : item.watchedAt,
        })

        setShowEditModal(false)
    }

    const handleDelete = () => {
        removeFromWatchlist(item.id)
        setShowDeleteModal(false)
    }

    const handleMarkAsWatched = () => {
        markAsWatched(item.id)
        setShowDropdown(false)
    }

    const handleMoveToCategory = (newCategory: string) => {
        moveToCategory(item.id, newCategory)
        setShowDropdown(false)
    }

    const handleCardClick = (e: React.MouseEvent) => {
        if (e.ctrlKey || e.metaKey) {
            onToggleSelect()
        } else {
            navigate(`/movie/${item.id}`)
        }
    }

    const getPriorityColor = (priority: Priority) => {
        switch (priority) {
            case 'high':
                return 'text-red-600 bg-red-100 dark:bg-red-900/20'
            case 'medium':
                return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20'
            case 'low':
                return 'text-green-600 bg-green-100 dark:bg-green-900/20'
            default:
                return 'text-gray-600 bg-gray-100 dark:bg-gray-700'
        }
    }

    const getPriorityIcon = (priority: Priority) => {
        switch (priority) {
            case 'high':
                return ArrowUpCircle
            case 'medium':
                return MinusCircle
            case 'low':
                return ArrowDownCircle
            default:
                return MinusCircle
        }
    }

    if (viewMode === 'list') {
        return (
            <Draggable draggableId={item.id.toString()} index={index}>
                {(provided, snapshot) => (
                    <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={cn(
                            'transition-all duration-200',
                            snapshot.isDragging && 'shadow-lg rotate-1',
                            isSelected && 'ring-2 ring-primary-500'
                        )}
                    >
                        <div className="flex items-center space-x-4">
                            {/* Selection Checkbox */}
                            <div className="flex-shrink-0">
                                <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={onToggleSelect}
                                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                />
                            </div>

                            {/* Poster */}
                            <div className="flex-shrink-0">
                                <img
                                    src={posterUrl}
                                    alt={item.movie.title}
                                    className="w-12 h-18 object-cover rounded cursor-pointer"
                                    onClick={handleCardClick}
                                />
                            </div>

                            {/* Movie Info */}
                            <div className="flex-1 min-w-0 cursor-pointer" onClick={handleCardClick}>
                                <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                                    {item.movie.title}
                                </h3>
                                <div className="flex items-center space-x-3 mt-1">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {year}
                                    </span>
                                    <div className="flex items-center space-x-1">
                                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {item.movie.vote_average.toFixed(1)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Personal Rating */}
                            {item.personalRating && (
                                <div className="flex-shrink-0">
                                    <Rating
                                        rating={item.personalRating}
                                        maxRating={10}
                                        size="sm"
                                        showNumber={false}
                                    />
                                </div>
                            )}

                            {/* Priority */}
                            <div className="flex-shrink-0">
                                {(() => {
                                    const PriorityIcon = getPriorityIcon(item.priority || 'medium')
                                    return (
                                        <Badge
                                            variant="default"
                                            size="sm"
                                            className={getPriorityColor(item.priority || 'medium')}
                                        >
                                            <PriorityIcon className="w-3 h-3 mr-1" />
                                            {(item.priority || 'medium').charAt(0).toUpperCase()}
                                        </Badge>
                                    )
                                })()}
                            </div>

                            {/* Added Date */}
                            <div className="flex-shrink-0 text-sm text-gray-500 dark:text-gray-400">
                                {formatDate(item.addedAt)}
                            </div>

                            {/* Actions */}
                            <div className="flex-shrink-0 relative">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="p-1"
                                >
                                    <MoreVertical className="w-4 h-4" />
                                </Button>

                                {showDropdown && (
                                    <ActionDropdown
                                        item={item}
                                        category={category}
                                        onEdit={handleEdit}
                                        onDelete={() => setShowDeleteModal(true)}
                                        onMarkWatched={handleMarkAsWatched}
                                        onMoveToCategory={handleMoveToCategory}
                                        onClose={() => setShowDropdown(false)}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Notes Preview */}
                        {item.personalNotes && (
                            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                    {item.personalNotes}
                                </p>
                            </div>
                        )}

                        {/* Tags */}
                        {item.tags && item.tags.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                                {item.tags.slice(0, 3).map((tag) => (
                                    <Badge key={tag} variant="default" size="sm">
                                        <Tag className="w-3 h-3 mr-1" />
                                        {tag}
                                    </Badge>
                                ))}
                                {item.tags.length > 3 && (
                                    <Badge variant="default" size="sm">
                                        +{item.tags.length - 3} more
                                    </Badge>
                                )}
                            </div>
                        )}
                    </Card>
                )}
            </Draggable>
        )
    }

    // Grid View
    return (
        <Draggable draggableId={item.id.toString()} index={index}>
            {(provided, snapshot) => (
                <Card
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    hover
                    padding="none"
                    className={cn(
                        'overflow-hidden cursor-pointer group transition-all duration-200',
                        snapshot.isDragging && 'shadow-xl rotate-2 scale-105',
                        isSelected && 'ring-2 ring-primary-500'
                    )}
                >
                    <div className="relative">
                        {/* Selection Checkbox */}
                        <div className="absolute top-2 left-2 z-10">
                            <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                    e.stopPropagation()
                                    onToggleSelect()
                                }}
                                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 bg-white/90"
                            />
                        </div>

                        {/* Priority Badge */}
                        <div className="absolute top-2 right-2 z-10">
                            {(() => {
                                const PriorityIcon = getPriorityIcon(item.priority || 'medium')
                                return (
                                    <Badge
                                        variant="default"
                                        size="sm"
                                        className={cn('backdrop-blur-sm', getPriorityColor(item.priority || 'medium'))}
                                    >
                                        <PriorityIcon className="w-3 h-3" />
                                    </Badge>
                                )
                            })()}
                        </div>

                        {/* Movie Poster */}
                        <div className="aspect-[2/3] relative" onClick={handleCardClick}>
                            <img
                                src={posterUrl}
                                alt={item.movie.title}
                                className="w-full h-full object-cover"
                            />

                            {/* Overlay on Hover */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                                <Button variant="primary" size="sm">
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Details
                                </Button>
                            </div>
                        </div>

                        {/* Movie Info */}
                        <div className="p-3">
                            <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1 mb-2">
                                {item.movie.title}
                            </h3>

                            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                                <span>{year}</span>
                                <div className="flex items-center space-x-1">
                                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                    <span>{item.movie.vote_average.toFixed(1)}</span>
                                </div>
                            </div>

                            {/* Personal Rating */}
                            {item.personalRating && (
                                <div className="mb-2">
                                    <Rating
                                        rating={item.personalRating}
                                        maxRating={10}
                                        size="sm"
                                        showNumber={false}
                                    />
                                </div>
                            )}

                            {/* Tags */}
                            {item.tags && item.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-2">
                                    {item.tags.slice(0, 2).map((tag) => (
                                        <Badge key={tag} variant="default" size="sm">
                                            {tag}
                                        </Badge>
                                    ))}
                                    {item.tags.length > 2 && (
                                        <Badge variant="default" size="sm">
                                            +{item.tags.length - 2}
                                        </Badge>
                                    )}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    Added {formatDate(item.addedAt)}
                                </span>

                                <div className="relative">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setShowDropdown(!showDropdown)
                                        }}
                                        className="p-1"
                                    >
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>

                                    {showDropdown && (
                                        <ActionDropdown
                                            item={item}
                                            category={category}
                                            onEdit={handleEdit}
                                            onDelete={() => setShowDeleteModal(true)}
                                            onMarkWatched={handleMarkAsWatched}
                                            onMoveToCategory={handleMoveToCategory}
                                            onClose={() => setShowDropdown(false)}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            )}
        </Draggable>
    )


    return (
        <>
            {/* Main Component JSX above */}

            {/* Edit Modal */}
            <Modal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                title="Edit Movie Details"
                size="lg"
            >
                <div className="space-y-6">
                    {/* Personal Rating */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Personal Rating
                        </label>
                        <Rating
                            rating={editingRating}
                            maxRating={10}
                            size="lg"
                            interactive
                            onChange={setEditingRating}
                            showNumber
                        />
                    </div>

                    {/* Personal Notes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Personal Notes
                        </label>
                        <textarea
                            value={editingNotes}
                            onChange={(e) => setEditingNotes(e.target.value)}
                            placeholder="Add your thoughts about this movie..."
                            className="w-full h-24 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                    </div>

                    {/* Priority */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Priority
                        </label>
                        <select
                            value={editingPriority}
                            onChange={(e) => setEditingPriority(e.target.value as Priority)}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        >
                            <option value="high">High Priority</option>
                            <option value="medium">Medium Priority</option>
                            <option value="low">Low Priority</option>
                        </select>
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Tags (comma-separated)
                        </label>
                        <Input
                            value={editingTags}
                            onChange={(e) => setEditingTags(e.target.value)}
                            placeholder="action, sci-fi, must-watch..."
                        />
                    </div>

                    {/* Watch Date */}
                    {item.watched && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Watch Date
                            </label>
                            <Input
                                type="date"
                                value={editingWatchedDate}
                                onChange={(e) => setEditingWatchedDate(e.target.value)}
                            />
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-end space-x-3">
                        <Button
                            variant="outline"
                            onClick={() => setShowEditModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleSaveEdit}>
                            Save Changes
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Remove from Watchlist"
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-400">
                        Are you sure you want to remove "{item.movie.title}" from your watchlist? This action cannot be undone.
                    </p>

                    <div className="flex items-center justify-end space-x-3">
                        <Button
                            variant="outline"
                            onClick={() => setShowDeleteModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleDelete}>
                            Remove
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    )
}

// Action Dropdown Component
const ActionDropdown: React.FC<{
    item: WatchlistItemType
    category: string
    onEdit: () => void
    onDelete: () => void
    onMarkWatched: () => void
    onMoveToCategory: (category: string) => void
    onClose: () => void
}> = ({ item, category, onEdit, onDelete, onMarkWatched, onMoveToCategory, onClose }) => {
    const categories = [
        { key: 'to-watch', label: 'To Watch', icon: Clock },
        { key: 'watching', label: 'Currently Watching', icon: Eye },
        { key: 'watched', label: 'Watched', icon: CheckCircle },
        { key: 'favorites', label: 'Favorites', icon: Heart },
    ]

    return (
        <div className="absolute right-0 top-8 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
            <div className="py-1">
                {/* Edit */}
                <button
                    onClick={onEdit}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    <Edit3 className="w-4 h-4 mr-3" />
                    Edit Details
                </button>

                {/* Mark as Watched */}
                {!item.watched && (
                    <button
                        onClick={onMarkWatched}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <CheckCircle className="w-4 h-4 mr-3" />
                        Mark as Watched
                    </button>
                )}

                {/* Move to Categories */}
                <div className="border-t border-gray-200 dark:border-gray-700 my-1">
                    <div className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                        Move to:
                    </div>
                    {categories
                        .filter(cat => cat.key !== category)
                        .map(cat => {
                            const Icon = cat.icon
                            return (
                                <button
                                    key={cat.key}
                                    onClick={() => onMoveToCategory(cat.key)}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <Icon className="w-4 h-4 mr-3" />
                                    {cat.label}
                                </button>
                            )
                        })}
                </div>

                {/* Delete */}
                <div className="border-t border-gray-200 dark:border-gray-700 my-1">
                    <button
                        onClick={onDelete}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                        <Trash2 className="w-4 h-4 mr-3" />
                        Remove from Watchlist
                    </button>
                </div>
            </div>

            {/* Click outside to close */}
            <div
                className="fixed inset-0 z-40"
                onClick={onClose}
            />
        </div>
    )
}