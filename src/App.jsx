import React, { useEffect, useMemo, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { Add, ContentCopy, ExpandLess, ExpandMore, Remove } from '@mui/icons-material';
import { arrayFP, arrayP1 } from './data';

const buildingOptions = [
  { name: 'Aachener Dom', age: 3 },
  { name: 'Alcatraz', age: 8 },
  { name: 'Arche', age: 13 },
  { name: 'Arktische Orangerie', age: 14 },
  { name: 'Atlantis Museum', age: 15 },
  { name: 'Atomium', age: 9 },
  { name: 'Basilius-Kathedrale', age: 5 },
  { name: 'Blaue Galaxie', age: 15 },
  { name: 'Burg Himeji', age: 16 },
  { name: 'Cape Canaveral', age: 10 },
  { name: 'Castel del Monte', age: 5 },
  { name: 'Château Frontenac', age: 8 },
  { name: 'Das Habitat', age: 10 },
  { name: 'Deal Castle', age: 6 },
  { name: 'Desdner Frauenkirche', age: 6 },
  { name: 'Fliegende Insel', age: 19 },
  { name: 'Friedensturm', age: 12 },
  { name: 'Gaea-Statue', age: 14 },
  { name: 'Galata Turm', age: 21 },
  { name: 'Hagia Sophia', age: 3 },
  { name: 'Innovation Tower', age: 11 },
  { name: 'Kapitol', age: 7 },
  { name: 'KI Kern', age: 20 },
  { name: 'Kolosseum', age: 2 },
  { name: 'Kosmischer Katalysator', age: 25 },
  { name: 'Kraken', age: 15 },
  { name: 'Turm zu Babel', age: 1 },
  { name: 'Leuchtturm v. Alexandria', age: 2 },
  { name: 'Lotustempel', age: 11 },
  { name: 'Markusdom', age: 4 },
  { name: 'Notre Dame', age: 4 },
  { name: 'Observatorium', age: 0 },
  { name: 'Regenwald-Projekt', age: 13 },
  { name: 'Relikttempel', age: 0 },
  { name: 'Royal Albert Hall', age: 7 },
  { name: 'Saatgut-Tresor', age: 14 },
  { name: 'Space Needle', age: 9 },
  { name: 'Saturn VI Gate PEGASUS', age: 22 },
  { name: 'Saturn VI Gate CENTAURUS', age: 23 },
  { name: 'Saturn VI Gate HYDRA', age: 24 },
  { name: 'Star Gazer', age: 17 },
  { name: 'Stellares Kriegsschiff', age: 26 },
  { name: 'Terrakotta-Armee', age: 16 },
  { name: 'Voyager V1', age: 12 },
  { name: 'Virgo-Projekt', age: 17 },
  { name: 'Weltraumfrachter', age: 18 },
  { name: 'Zeus', age: 1 },
];

const defaultFactors = [1.9, 1.9, 1.9, 1.9, 1.9];
const defaultExternals = [0, 0, 0, 0, 0];

const loadWorldData = () => {
  if (typeof localStorage === 'undefined') return { worlds: { Standard: null }, collapsedWorlds: {} };
  try {
    const stored = JSON.parse(localStorage.getItem('LGWorldData'));
    if (stored && stored.worlds) {
      return {
        worlds: stored.worlds,
        collapsedWorlds: stored.collapsedWorlds || {},
      };
    }
  } catch (e) {
    // ignore
  }
  return { worlds: { Standard: null }, collapsedWorlds: {} };
};

const normalizeWorlds = (data) => {
  const normalized = { ...data.worlds };
  Object.keys(normalized).forEach((world) => {
    const list = normalized[world];
    if (!Array.isArray(list) || list.length === 0) {
      normalized[world] = [createDefaultLG(true)];
    } else {
      normalized[world] = list.map((item, idx) => ({
        name: item.LG || item.name || 'Arche',
        level: Number(item.Level ?? item.level ?? 1),
        active: idx === 0 ? true : Boolean(item.Active ?? item.active),
        externals: item.External || item.externals || defaultExternals,
        factors: item.Factor || item.factors || defaultFactors,
      }));
    }
  });
  return normalized;
};

const createDefaultLG = (active = false) => ({
  name: 'Arche',
  level: 1,
  active,
  externals: [...defaultExternals],
  factors: [...defaultFactors],
});

const findAge = (name) => buildingOptions.find((b) => b.name === name)?.age ?? 0;

const calculateRewards = (age, level, factors, externals) => {
  const sanitizedLevel = Math.max(1, Number(level) || 1);
  const baseRewards = arrayP1[age] || [];
  const maxLevel = baseRewards.length ? baseRewards.length - 1 : sanitizedLevel;
  const levelIndex = Math.min(sanitizedLevel, maxLevel);
  const pbonus = [];
  pbonus.push(baseRewards[levelIndex] ?? 0);
  pbonus.push(5 * Math.round((pbonus[0] / 2) / 5));
  pbonus.push(5 * Math.round((pbonus[1] / 3) / 5));
  pbonus.push(5 * Math.round((pbonus[2] / 4) / 5));
  pbonus.push(5 * Math.round((pbonus[3] / 5) / 5));

  const baseFP = arrayFP[age] || [];
  const totalFP = levelIndex < 11 ? (baseFP[levelIndex] || 0) : Math.ceil((baseFP[10] || 0) * Math.pow(1.025, levelIndex - 10));

  const pcost = pbonus.map((bonus, idx) => Math.round(bonus * (Number(factors[idx]) || 0)));

  const externalList = [...externals].map((v) => Number(v) || 0);
  const sorted = [...externalList].sort((a, b) => b - a);
  const sortedForSave = [...externalList].sort((a, b) => b - a);
  const sumExternals = sortedForSave.reduce((sum, val) => sum + val, 0);

  const ptaker = [0, 0, 0, 0, 0];
  const remaining = [...sorted];
  pcost.forEach((cost, i) => {
    for (let j = 0; j < remaining.length; j += 1) {
      if (remaining[j] >= cost) {
        ptaker[i] = remaining[j];
        remaining.splice(j, 1);
        break;
      }
    }
  });

  const pfinal = pcost.map((cost, i) => (ptaker[i] > 0 ? ptaker[i] : cost));

  const selfInvest = [0, 0, 0, 0, 0];
  pcost.forEach((cost, i) => {
    for (let j = 0; j < sortedForSave.length; j += 1) {
      if (cost > sortedForSave[j] || sortedForSave[j] === 0) {
        let value = totalFP + sortedForSave[j] - cost * 2 - sumExternals;
        for (let k = 0; k < i; k += 1) {
          if (ptaker[k] < 1) value -= pfinal[k];
        }
        selfInvest[i] = value;
        break;
      }
    }
  });

  let tempMax = 0;
  const save = [];
  const self = [];
  selfInvest.forEach((val, i) => {
    if (ptaker[i] < 1) {
      if (val > tempMax) {
        const relative = val - tempMax;
        tempMax = val;
        save[i] = `+${relative}`;
        self[i] = pcost[i] === 0 ? `!${val}!` : `${val}`;
      } else {
        const relative = val - tempMax;
        save[i] = 'Sicher';
        self[i] = `${relative}`;
      }
    } else {
      save[i] = '-';
      self[i] = '-';
    }
  });

  return {
    levelIndex,
    totalFP,
    pbonus,
    pcost,
    pfinal,
    save,
    self,
  };
};

const useLocalStorage = (worldData) => {
  useEffect(() => {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem('LGWorldData', JSON.stringify(worldData));
  }, [worldData]);
};

const App = () => {
  const [worldData, setWorldData] = useState(() => {
    const loaded = loadWorldData();
    return {
      worlds: normalizeWorlds(loaded),
      collapsedWorlds: loaded.collapsedWorlds || {},
    };
  });
  const [activeSelection, setActiveSelection] = useState({ world: 'Standard', index: 0 });
  const [username, setUsername] = useState(localStorage.getItem('LGCopyUsername') || '');
  const [copyPositions, setCopyPositions] = useState(['P5', 'P4', 'P3', 'P2', 'P1']);
  const [outbidInputs, setOutbidInputs] = useState({ gbTotal: 0, inGB: 0, toBeat: 0 });
  const [ownArcInputs, setOwnArcInputs] = useState({ factor1: 1.9, factor2: 1.9, base: 0 });

  useLocalStorage(worldData);

  useEffect(() => {
    setUsername((prev) => {
      localStorage.setItem('LGCopyUsername', prev);
      return prev;
    });
  }, [username]);

  useEffect(() => {
    const { world, index } = activeSelection;
    if (!worldData.worlds[world]) {
      const firstWorld = Object.keys(worldData.worlds)[0];
      setActiveSelection({ world: firstWorld, index: 0 });
    } else if (index >= worldData.worlds[world].length) {
      setActiveSelection({ world, index: 0 });
    }
  }, [activeSelection, worldData.worlds]);

  const updateWorlds = (updater) => {
    setWorldData((prev) => ({
      ...prev,
      worlds: updater(prev.worlds),
    }));
  };

  const handleAddWorld = () => {
    const name = prompt('Welt Name?');
    if (!name) return;
    updateWorlds((worlds) => {
      if (worlds[name]) return worlds;
      return {
        ...worlds,
        [name]: [createDefaultLG(false)],
      };
    });
  };

  const handleRemoveWorld = (world) => {
    updateWorlds((worlds) => {
      if (Object.keys(worlds).length <= 1) return worlds;
      const updated = { ...worlds };
      delete updated[world];
      return updated;
    });
    setWorldData((prev) => {
      const updatedCollapsed = { ...prev.collapsedWorlds };
      delete updatedCollapsed[world];
      return { ...prev, collapsedWorlds: updatedCollapsed };
    });
    if (activeSelection.world === world) {
      const remaining = Object.keys(worldData.worlds).filter((w) => w !== world);
      const nextWorld = remaining[0];
      setActiveSelection({ world: nextWorld, index: 0 });
    }
  };

  const handleAddLG = (world) => {
    updateWorlds((worlds) => ({
      ...worlds,
      [world]: [...worlds[world], createDefaultLG(false)],
    }));
  };

  const handleRemoveLG = (world) => {
    updateWorlds((worlds) => {
      const list = worlds[world];
      if (list.length <= 1) return worlds;
      const updated = list.slice(0, -1);
      return { ...worlds, [world]: updated };
    });
    if (activeSelection.world === world) {
      setActiveSelection((prev) => ({ ...prev, index: Math.max(0, prev.index - 1) }));
    }
  };

  const handleLGChange = (world, idx, changes) => {
    updateWorlds((worlds) => {
      const list = worlds[world];
      const updated = list.map((item, i) => (i === idx ? { ...item, ...changes } : item));
      return { ...worlds, [world]: updated };
    });
  };

  const handleSetActive = (world, idx) => {
    updateWorlds((worlds) => {
      const updated = {
        ...worlds,
        [world]: worlds[world].map((item, i) => ({ ...item, active: i === idx })),
      };
      return updated;
    });
    setActiveSelection({ world, index: idx });
  };

  const handleFactorChange = (position, value) => {
    const numeric = Number(value);
    const validValue = Number.isNaN(numeric) ? 0 : numeric;
    const { world, index } = activeSelection;
    const current = worldData.worlds[world]?.[index];
    if (!current) return;
    const updatedFactors = current.factors.map((f, i) => (i === position ? validValue : f));
    handleLGChange(world, index, { factors: updatedFactors });
  };

  const handleExternalChange = (position, value) => {
    const numeric = Number(value);
    const { world, index } = activeSelection;
    const current = worldData.worlds[world]?.[index];
    if (!current) return;
    const updatedExternals = current.externals.map((f, i) => (i === position ? numeric : f));
    handleLGChange(world, index, { externals: updatedExternals });
  };

  const handleSetFactors = (value) => {
    const { world, index } = activeSelection;
    const current = worldData.worlds[world]?.[index];
    if (!current) return;
    handleLGChange(world, index, { factors: current.factors.map(() => value) });
  };

  const activeLG = useMemo(() => {
    const { world, index } = activeSelection;
    const currentList = worldData.worlds[world];
    return currentList ? currentList[index] : null;
  }, [activeSelection, worldData.worlds]);

  const calculation = useMemo(() => {
    if (!activeLG) return null;
    const age = findAge(activeLG.name);
    return calculateRewards(age, activeLG.level, activeLG.factors, activeLG.externals);
  }, [activeLG]);

  const copyOutput = useMemo(() => {
    if (!activeLG || !calculation) return '';
    const selected = [...copyPositions].reverse();
    const positions = ['P1', 'P2', 'P3', 'P4', 'P5'];
    const textParts = positions
      .map((label, idx) => ({ label, value: calculation.pfinal[idx] }))
      .filter((entry) => copyPositions.includes(entry.label));
    const suffix = textParts.map((entry) => `${entry.label} (${entry.value})`).join(' ');
    return `${username} ${activeLG.name} ${suffix}`.trim();
  }, [activeLG, calculation, copyPositions, username]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyOutput);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  const outbidResult = useMemo(() => {
    const { gbTotal, inGB, toBeat } = outbidInputs;
    if (gbTotal < inGB) return 'Eingabefehler: Gesamt-FP < FP in LG';
    if (inGB < toBeat) return 'Eingabefehler: FP in LG < Zu überbieten';
    if (gbTotal - inGB <= toBeat) return 'nicht möglich';
    return Math.ceil((gbTotal - inGB + toBeat) / 2);
  }, [outbidInputs]);

  const arcResult = useMemo(() => {
    const { factor1, factor2, base } = ownArcInputs;
    const value1 = Math.round((Number(factor1) || 0) * (Number(base) || 0));
    const value2 = Math.round((Number(factor2) || 0) * (Number(base) || 0));
    return {
      value1,
      value2,
      diff: value2 - value1,
    };
  }, [ownArcInputs]);

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div">
            FOE Toolbox (React)
          </Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{ py: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">Welten</Typography>
          <Button variant="contained" startIcon={<Add />} onClick={handleAddWorld}>
            Welt hinzufügen
          </Button>
        </Stack>

        <Stack spacing={2}>
          {Object.entries(worldData.worlds).map(([world, list], worldIdx) => (
            <Accordion
              key={world}
              expanded={!worldData.collapsedWorlds?.[world]}
              onChange={() =>
                setWorldData((prev) => ({
                  ...prev,
                  collapsedWorlds: {
                    ...prev.collapsedWorlds,
                    [world]: !prev.collapsedWorlds?.[world],
                  },
                }))
              }
            >
              <AccordionSummary expandIcon={worldData.collapsedWorlds?.[world] ? <ExpandMore /> : <ExpandLess />}>
                <Stack direction="row" spacing={2} alignItems="center" flex={1}>
                  <Typography variant="h6">{world}</Typography>
                  <Stack direction="row" spacing={1}>
                    {worldIdx === 0 && (
                      <Button size="small" startIcon={<Add />} onClick={(e) => { e.stopPropagation(); handleAddLG(world); }}>
                        LG hinzufügen
                      </Button>
                    )}
                    <Button
                      size="small"
                      color="error"
                      startIcon={<Remove />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveWorld(world);
                      }}
                    >
                      Welt löschen
                    </Button>
                  </Stack>
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={2}>
                  {list.map((lg, idx) => (
                    <Paper key={`${world}-${idx}`} sx={{ p: 2 }} variant={lg.active ? 'outlined' : 'elevation'}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={4}>
                          <TextField
                            select
                            fullWidth
                            label="LG"
                            value={lg.name}
                            onChange={(e) => handleLGChange(world, idx, { name: e.target.value })}
                          >
                            {buildingOptions.map((opt) => (
                              <MenuItem key={opt.name} value={opt.name}>
                                {opt.name}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                        <Grid item xs={6} md={2}>
                          <TextField
                            label="Level"
                            type="number"
                            fullWidth
                            inputProps={{ min: 1 }}
                            value={lg.level}
                            onChange={(e) => handleLGChange(world, idx, { level: Math.max(1, Number(e.target.value) || 1) })}
                          />
                        </Grid>
                        <Grid item xs={6} md={2}>
                          <Button
                            variant={lg.active ? 'contained' : 'outlined'}
                            fullWidth
                            onClick={() => handleSetActive(world, idx)}
                          >
                            Aktiv
                          </Button>
                        </Grid>
                        <Grid item xs={6} md={2}>
                          <IconButton onClick={() => handleLGChange(world, idx, { level: Math.max(1, lg.level + 1) })}>
                            <Add />
                          </IconButton>
                          <IconButton onClick={() => handleLGChange(world, idx, { level: Math.max(1, lg.level - 1) })}>
                            <Remove />
                          </IconButton>
                        </Grid>
                        <Grid item xs={6} md={2}>
                          <Button color="error" onClick={() => handleRemoveLG(world)} disabled={list.length <= 1}>
                            Eintrag entfernen
                          </Button>
                        </Grid>
                      </Grid>
                    </Paper>
                  ))}
                </Stack>
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" gutterBottom>
          Arche-Förderung
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Platz</TableCell>
                  <TableCell>Faktor</TableCell>
                  <TableCell>Mäzen</TableCell>
                  <TableCell>Kosten</TableCell>
                  <TableCell>Ext. ⤺</TableCell>
                  <TableCell>Sichern</TableCell>
                  <TableCell>∑-Sichern</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[0, 1, 2, 3, 4].map((i) => (
                  <TableRow key={i} selected={i === 0}>
                    <TableCell>P{i + 1}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <TextField
                          size="small"
                          type="number"
                          inputProps={{ step: 0.01, min: 1, max: 3 }}
                          value={activeLG?.factors[i] ?? defaultFactors[i]}
                          onChange={(e) => handleFactorChange(i, e.target.value)}
                        />
                        <Stack direction="column" spacing={0.5}>
                          <Button variant="outlined" size="small" onClick={() => handleFactorChange(i, (Number(activeLG?.factors[i]) || 0) + 0.01)}>
                            +
                          </Button>
                          <Button variant="outlined" size="small" onClick={() => handleFactorChange(i, (Number(activeLG?.factors[i]) || 0) - 0.01)}>
                            -
                          </Button>
                        </Stack>
                      </Stack>
                    </TableCell>
                    <TableCell>{calculation?.pbonus?.[i] ?? 0}</TableCell>
                    <TableCell>{calculation?.pcost?.[i] ?? 0}</TableCell>
                    <TableCell>{calculation?.pfinal?.[i] ?? '-'}</TableCell>
                    <TableCell>{calculation?.save?.[i] ?? '-'}</TableCell>
                    <TableCell>{calculation?.self?.[i] ?? '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1">Externe</Typography>
              <Stack spacing={1} mt={1}>
                {defaultExternals.map((_, idx) => (
                  <TextField
                    key={idx}
                    label={`Externe ${idx + 1}`}
                    type="number"
                    value={activeLG?.externals[idx] ?? 0}
                    onChange={(e) => handleExternalChange(idx, e.target.value)}
                  />
                ))}
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        <Stack direction="row" spacing={2} mt={2}>
          {[1.9, 1.93, 1.94].map((val) => (
            <Button key={val} variant="outlined" onClick={() => handleSetFactors(val)}>
              {val.toFixed(2)}
            </Button>
          ))}
          <Paper sx={{ p: 1, ml: 'auto', minWidth: 180 }}>
            <Typography variant="subtitle1">FP-∑: {calculation?.totalFP ?? 0}</Typography>
          </Paper>
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" gutterBottom>
          Kopieren in den Gildenchat
        </Typography>
        <Paper sx={{ p: 2 }}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={2} alignItems="center">
              <TextField label="Spielername" value={username} onChange={(e) => setUsername(e.target.value)} />
              <ToggleButtonGroup
                value={copyPositions}
                onChange={(_, value) => value.length && setCopyPositions(value)}
                aria-label="Copy positions"
              >
                {['P5', 'P4', 'P3', 'P2', 'P1'].map((pos) => (
                  <ToggleButton key={pos} value={pos} selected={copyPositions.includes(pos)}>
                    {pos}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
              <Button variant="contained" startIcon={<ContentCopy />} onClick={handleCopy}>
                Kopieren
              </Button>
            </Stack>
            <TextField fullWidth value={copyOutput} label="Nachricht" InputProps={{ readOnly: true }} />
          </Stack>
        </Paper>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" gutterBottom>
          Überbieten &amp; Sichern
        </Typography>
        <Paper sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                label="FP-∑ Level"
                type="number"
                fullWidth
                value={outbidInputs.gbTotal}
                onChange={(e) => setOutbidInputs((prev) => ({ ...prev, gbTotal: Number(e.target.value) }))}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="FP Stand"
                type="number"
                fullWidth
                value={outbidInputs.inGB}
                onChange={(e) => setOutbidInputs((prev) => ({ ...prev, inGB: Number(e.target.value) }))}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Zu überbieten"
                type="number"
                fullWidth
                value={outbidInputs.toBeat}
                onChange={(e) => setOutbidInputs((prev) => ({ ...prev, toBeat: Number(e.target.value) }))}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Benötigte FP: {outbidResult}</Typography>
            </Grid>
          </Grid>
        </Paper>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" gutterBottom>
          Invest Rechner
        </Typography>
        <Paper sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                label="Arche Faktor"
                type="number"
                inputProps={{ step: 0.01 }}
                fullWidth
                value={ownArcInputs.factor1}
                onChange={(e) => setOwnArcInputs((prev) => ({ ...prev, factor1: Number(e.target.value) }))}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Arche Faktor 2"
                type="number"
                inputProps={{ step: 0.01 }}
                fullWidth
                value={ownArcInputs.factor2}
                onChange={(e) => setOwnArcInputs((prev) => ({ ...prev, factor2: Number(e.target.value) }))}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Mäzen"
                type="number"
                fullWidth
                value={ownArcInputs.base}
                onChange={(e) => setOwnArcInputs((prev) => ({ ...prev, base: Number(e.target.value) }))}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1">Gewinn: {arcResult.value1}</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1">Gewinn 2: {arcResult.value2}</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1">Differenz: {arcResult.diff}</Typography>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default App;
