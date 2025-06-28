import { Skeleton, Grid, Card, CardContent, Box } from "@mui/material";

const DashboardSkeleton = () => {
  return (
    <Box p={3}>
      <Skeleton variant="text" width="30%" height={40} />

      <Grid container spacing={3} mt={1}>
        {/* Finance Summary Skeleton */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Skeleton variant="text" width="50%" height={30} />
              <Skeleton variant="rectangular" width="100%" height={10} sx={{ my: 2 }} />
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="80%" />
            </CardContent>
          </Card>
        </Grid>

        {/* Today Collection Summary Skeleton */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Skeleton variant="text" width="60%" height={30} />
              <Skeleton variant="rectangular" width="100%" height={10} sx={{ my: 2 }} />
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="80%" />
            </CardContent>
          </Card>
        </Grid>

        {/* Loan Status Skeleton */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Skeleton variant="text" width="50%" height={30} />
              <Skeleton variant="rectangular" width="100%" height={10} sx={{ my: 2 }} />
              <Skeleton variant="text" width="90%" />
              <Skeleton variant="text" width="90%" />
              <Skeleton variant="text" width="90%" />
            </CardContent>
          </Card>
        </Grid>

        {/* Customer Count Skeleton */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Skeleton variant="text" width="60%" height={30} />
              <Skeleton variant="rectangular" width="100%" height={10} sx={{ my: 2 }} />
              <Skeleton variant="text" width="70%" />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardSkeleton;
