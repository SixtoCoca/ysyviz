import { useState } from "react";

export const useChartConfig = () => {
    const [cfg, setCfg] = useState({
        title: "",
        type: "",
        color: "#4682b4",
    });

    return [cfg, setCfg];
};
