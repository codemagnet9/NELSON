import { Table } from '@/components/ui/table' // or your UI components path
import { cn } from '@/lib/utils' // or your common utils path

type CommentTableProps = React.ComponentProps<'table'>

const CommentTable = (props: CommentTableProps) => {
  const { className, ...rest } = props

  return <Table className={cn('not-prose my-2', className)} {...rest} />
}

export default CommentTable