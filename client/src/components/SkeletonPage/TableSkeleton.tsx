import  Skeleton  from '@mui/material/Skeleton'


const TableSkeleton = () => {
  return (
    <div style={{ marginTop: '2rem' }}>
    <Skeleton variant="text" width="60%" height={40} />
    <Skeleton variant="rectangular" height={400} />
  </div>
  )
}

export default TableSkeleton
