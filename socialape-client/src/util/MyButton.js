import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";

export default ({
  children,
  onClick,
  tip,
  btnClassName,
  tipClassName,
  placement = "top"
}) =>
  Boolean(tip) ? (
    <Tooltip title={tip} className={tipClassName} placement={placement}>
      <IconButton onClick={onClick} className={btnClassName}>
        {children}
      </IconButton>
    </Tooltip>
  ) : (
    <IconButton onClick={onClick} className={btnClassName}>
      {children}
    </IconButton>
  );
