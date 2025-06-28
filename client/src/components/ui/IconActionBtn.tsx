import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

interface IconActionButtonProps {
  title: string;
  icon:React.ReactNode;
  onClick: () => void;
  color?: "inherit" | "primary" | "secondary" | "default" | "error" | "info" | "success" | "warning";
  ariaLabel?: string;
}

const IconActionButton = ({
  title,
  icon,
  onClick,
  color = "primary",
  ariaLabel,
}: IconActionButtonProps) => {
  return (
    <Tooltip title={title}>
      <IconButton color={color} aria-label={ariaLabel || title} onClick={onClick}>
        {icon}
      </IconButton>
    </Tooltip>
  );
};

export default IconActionButton;
