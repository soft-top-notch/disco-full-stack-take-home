import * as React from "react";
import { Box, CircularProgress } from "@mui/material";

import { ProfileView } from "./ProfileView";
import { ApiService } from "../../utils/ApiService";
import { Profile } from "../../types";

export const ProfilesList: React.FC = (props) => {
  const [loading, setLoading] = React.useState(true);
  const [profiles, setProfiles] = React.useState<Profile[]>([]);

  const api = React.useMemo(() => new ApiService(), []);

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const allProfiles = await api.getAllProfiles();
        setProfiles(allProfiles);
        console.log("[ProfilesList] Successfully fetched all profiles from the backend");
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <Box sx={{ alignItems: "center", display: "flex", justifyContent: "center", padding: "50px 0", width: "100%" }}>
        <CircularProgress />
      </Box>
    );
  }

  return <Box>{profiles.map((p) => p.did && <ProfileView key={p.did} did={p.did} profile={p} />)}</Box>;
};
