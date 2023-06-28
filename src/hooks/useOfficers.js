import { useContext } from "react";
import { OfficerContext } from "../store";

export const useOfficers = () => {
    const [state, dispatch] = useContext(OfficerContext);

    return [state, dispatch];
}
