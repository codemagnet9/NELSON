'use client'

import { useState } from 'react'
import { ChevronRight, Folder, File } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TreeNode {
  id: string
  name: string
  children?: TreeNode[]
}

type TreeViewProps = {
  collection: TreeNode
}

const TreeNode = ({ node, level = 0 }: { node: TreeNode; level?: number }) => {
  const [isOpen, setIsOpen] = useState(false)
  const hasChildren = node.children && node.children.length > 0
  const isFile = !hasChildren

  return (
    <div>
      <div
        className={cn(
          'flex items-center py-1 hover:bg-accent rounded-sm cursor-pointer transition-colors',
          level > 0 && 'ml-4'
        )}
        style={{ paddingLeft: `${level * 12}px` }}
        onClick={() => hasChildren && setIsOpen(!isOpen)}
      >
        {hasChildren && (
          <ChevronRight
            className={cn(
              'h-3 w-3 mr-1 transition-transform duration-200',
              isOpen && 'rotate-90'
            )}
          />
        )}
        {isFile ? (
          <File className='h-3 w-3 mr-2 text-blue-500' />
        ) : (
          <Folder className='h-3 w-3 mr-2 text-yellow-500' />
        )}
        <span className='text-sm'>{node.name}</span>
      </div>
      {hasChildren && isOpen && (
        <div className='animate-in fade-in-50'>
          {node.children!.map((child) => (
            <TreeNode key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

const TreeView = (props: TreeViewProps) => {
  const { collection } = props

  return (
    <div className='not-prose rounded-lg border bg-card p-4'>
      <TreeNode node={collection} />
    </div>
  )
}

export default TreeView