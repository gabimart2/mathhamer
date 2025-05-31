import React from 'react'
import {
  Box,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper
} from '@mui/material'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts'

/**
 * TextResults: muestra en formato tabular los valores de mean/sigma
 * para cada métrica (analytics vs simulation), y además las distribuciones de kills.
 */
const TextResults = ({ data }) => {
  // Extraer las métricas (excepto killsDistribution) de analytics y simulation
  const metrics = [
    'attacks',
    'impacts',
    'wounds',
    'unsaved',
    'damageBeforeFNP',
    'damageAfterFNP',
    'kills'
    // (En simulation hay además wasted, pero aquí nos ceñimos a las comunes)
  ]

  // Preparar filas para la tabla de mean/sigma
  const rowsStats = metrics.map((metric) => ({
    metric,
    analyticsMean: data.analytics[metric]?.mean ?? '-',
    analyticsSigma: data.analytics[metric]?.sigma ?? '-',
    simulationMean: data.simulation[metric]?.mean ?? '-',
    simulationSigma: data.simulation[metric]?.sigma ?? '-'
  }))

  // Preparar datos de killsDistribution para analytics y simulation
  const analyticsKillsDist = data.analytics.killsDistribution
  const simulationKillsDist = data.simulation.killsDistribution

  // Unir ambas distribuciones en una tabla combinada por filas
  // (Se listarán todas las claves que aparezcan en alguno de los dos)
  const allKeys = Array.from(
    new Set([
      ...Object.keys(analyticsKillsDist),
      ...Object.keys(simulationKillsDist)
    ])
  ).sort((a, b) => Number(a) - Number(b))

  const rowsKillsDist = allKeys.map((key) => ({
    kills: key,
    analytics: analyticsKillsDist[key] !== undefined ? analyticsKillsDist[key] : 0,
    simulation: simulationKillsDist[key] !== undefined ? simulationKillsDist[key] : 0
  }))

  return (
    <Box>
      {/* Tabla de estadísticas de mean / sigma */}
      <Typography variant='h6' gutterBottom>
        Estadísticas (Media y Sigma)
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell>Métrica</TableCell>
              <TableCell align='right'>Analytics Mean</TableCell>
              <TableCell align='right'>Analytics Sigma</TableCell>
              <TableCell align='right'>Simulation Mean</TableCell>
              <TableCell align='right'>Simulation Sigma</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rowsStats.map((row) => (
              <TableRow key={row.metric}>
                <TableCell component='th' scope='row'>
                  {row.metric}
                </TableCell>
                <TableCell align='right'>
                  {typeof row.analyticsMean === 'number'
                    ? row.analyticsMean.toFixed(4)
                    : row.analyticsMean}
                </TableCell>
                <TableCell align='right'>
                  {typeof row.analyticsSigma === 'number'
                    ? row.analyticsSigma.toFixed(4)
                    : row.analyticsSigma}
                </TableCell>
                <TableCell align='right'>
                  {typeof row.simulationMean === 'number'
                    ? row.simulationMean.toFixed(4)
                    : row.simulationMean}
                </TableCell>
                <TableCell align='right'>
                  {typeof row.simulationSigma === 'number'
                    ? row.simulationSigma.toFixed(4)
                    : row.simulationSigma}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Tabla de distribución de kills */}
      <Typography variant='h6' gutterBottom>
        Distribución de “Kills”
      </Typography>
      <TableContainer component={Paper}>
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell>Numero de Kills</TableCell>
              <TableCell align='right'>Analytics</TableCell>
              <TableCell align='right'>Simulation</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rowsKillsDist.map((row) => (
              <TableRow key={row.kills}>
                <TableCell component='th' scope='row'>
                  {row.kills}
                </TableCell>
                <TableCell align='right'>
                  {row.analytics.toFixed(5)}
                </TableCell>
                <TableCell align='right'>
                  {row.simulation.toFixed(5)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

/**
 * GraphResults: muestra dos gráficos usando Recharts:
 *  1) Un chart de barras que compara las medias (“mean”) de cada métrica.
 *  2) Un chart de barras que compara la distribución de “kills” para analytics vs simulation.
 */
const GraphResults = ({ data }) => {
  // Preparar datos para el gráfico de medias
  const metrics = [
    'attacks',
    'impacts',
    'wounds',
    'unsaved',
    'damageBeforeFNP',
    'damageAfterFNP',
    'kills'
  ]

  const meansData = metrics.map((metric) => ({
    name: metric,
    analytics: data.analytics[metric]?.mean ?? 0,
    simulation: data.simulation[metric]?.mean ?? 0
  }))

  // Preparar datos para la distribución de kills (unificar claves)
  const analyticsKillsDist = data.analytics.killsDistribution
  const simulationKillsDist = data.simulation.killsDistribution
  const allKeys = Array.from(
    new Set([
      ...Object.keys(analyticsKillsDist),
      ...Object.keys(simulationKillsDist)
    ])
  ).sort((a, b) => Number(a) - Number(b))

  const killsChartData = allKeys.map((key) => ({
    kills: key,
    analytics: analyticsKillsDist[key] !== undefined ? analyticsKillsDist[key] : 0,
    simulation: simulationKillsDist[key] !== undefined ? simulationKillsDist[key] : 0
  }))

  return (
    <Box>
      {/* Gráfico de comparación de medias */}
      <Typography variant='h6' gutterBottom>
        Comparación de Medias (Mean)
      </Typography>
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ height: 350 }}>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={meansData} margin={{ top: 20, bottom: 20, left: 10, right: 10 }}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey='analytics' name='Analytics' />
              <Bar dataKey='simulation' name='Simulation' />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de distribución de kills */}
      <Typography variant='h6' gutterBottom>
        Distribución de “Kills”
      </Typography>
      <Card>
        <CardContent sx={{ height: 350 }}>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={killsChartData} margin={{ top: 20, bottom: 20, left: 10, right: 10 }}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='kills' />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey='analytics' name='Analytics' />
              <Bar dataKey='simulation' name='Simulation' />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </Box>
  )
}

/**
 * ResultsViewer: componente principal que recibe el objeto “data”
 * con la estructura que has proporcionado y lo delega a TextResults y GraphResults.
 */
const ResultsViewer = ({ data }) => {
  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid container spacing={2}>
        {/* Columnas: en pantallas md+ TextResults / GraphResults lado a lado; en xs se apilan */}
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <TextResults data={data} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <GraphResults data={data} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

// Ejemplo de uso: si quieres probarlo directamente, puedes pasarle el objeto como prop.
// Por ejemplo, en tu App.jsx podrías hacer:
//
// import React from 'react';
// import ResultsViewer from './components/ResultsViewer';
//
// const data = {
//   analytics: { ... },
//   simulation: { ... }
// };
//
// function App() {
//   return (
//     <div>
//       <ResultsViewer data={data} />
//     </div>
//   );
// }
//
// export default App;
//
// Obviamente sustituye “{ ... }” por el objeto completo que has indicado.

export default ResultsViewer
