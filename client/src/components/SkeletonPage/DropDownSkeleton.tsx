import  Skeleton  from '@mui/material/Skeleton'
import type { FC } from 'react';

interface DropDownSkeletonProps{
    height:number;
    width:string;
}
const DropDownSkeleton:FC<DropDownSkeletonProps> = ({width,height}) => {
  return (
    <Skeleton variant="rectangular" height={height} width={width} />
  )
}

export default DropDownSkeleton
