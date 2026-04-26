import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, StatusBar, KeyboardAvoidingView, Platform,
  Dimensions, ImageBackground, Alert, Image, Keyboard, TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Grad from '../components/Grad';
import Colors from '../constants/colors';
import { useAuth, CompanyProject, MyCompany } from '../contexts/AuthContext';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavProp = NativeStackNavigationProp<RootStackParamList>;
type RouteP  = RouteProp<RootStackParamList, 'BusinessSetup'>;

const { width: SW } = Dimensions.get('window');

// ─── Constantes ───────────────────────────────────────────────────────────────
const LOGO_COLORS = [
  '#00C48C', '#2F6BFF', '#FF7A00', '#7B61FF',
  '#FF4D4D', '#0AC4FF', '#FFB300', '#FF6B00',
];

const COVER_PRESETS = [
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
  'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80',
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80',
  'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80',
  'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
];

const PROJECT_IMG_PRESETS = [
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
  'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80',
  'https://images.unsplash.com/photo-1577495508326-19a1b3cf65b9?w=600&q=80',
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80',
];

const CATEGORIES = [
  { label: 'Construção',  ionicon: 'construct-outline',     color: Colors.cyan   },
  { label: 'Engenharia',  ionicon: 'build-outline',         color: Colors.blue   },
  { label: 'Arquitetura', ionicon: 'compass-outline',       color: Colors.amber  },
  { label: 'Indústria',   ionicon: 'hardware-chip-outline', color: Colors.purple },
  { label: 'Consultoria', ionicon: 'bulb-outline',          color: '#FF6B00'     },
];

// ─── Certificações por país ───────────────────────────────────────────────────
const CERTS_BY_COUNTRY: Record<string, { id: string; label: string; desc: string }[]> = {
  Brasil: [
    { id: 'scip_br',  label: 'SCIP Certificado',  desc: 'Certificação oficial SCIP WORLD' },
    { id: 'abnt',     label: 'ABNT NBR',           desc: 'Norma Técnica Brasileira' },
    { id: 'crea',     label: 'CREA Registrado',    desc: 'Conselho Regional de Engenharia' },
    { id: 'cau',      label: 'CAU Registrado',     desc: 'Conselho de Arquitetura e Urbanismo' },
    { id: 'iso9001',  label: 'ISO 9001',           desc: 'Gestão da Qualidade' },
    { id: 'pbqph',    label: 'PBQP-H',             desc: 'Qualidade Habitacional' },
    { id: 'inmetro',  label: 'INMETRO',            desc: 'Certificação Nacional' },
  ],
  EUA: [
    { id: 'scip_us',  label: 'SCIP Certified',     desc: 'SCIP WORLD Official Certification' },
    { id: 'icc',      label: 'ICC Certified',       desc: 'International Code Council' },
    { id: 'leed',     label: 'LEED Certified',      desc: 'Green Building Standard' },
    { id: 'aia',      label: 'AIA Member',          desc: 'American Institute of Architects' },
    { id: 'osha',     label: 'OSHA Certified',      desc: 'Safety Standards' },
    { id: 'nfpa',     label: 'NFPA Compliant',      desc: 'Fire Protection Standards' },
    { id: 'miamidade',label: 'Miami-Dade Approved', desc: 'High-wind Impact Approval' },
  ],
  Argentina: [
    { id: 'scip_ar',  label: 'SCIP Certificado',   desc: 'Certificación oficial SCIP WORLD' },
    { id: 'iram',     label: 'IRAM Certificado',    desc: 'Instituto Argentino de Normalización' },
    { id: 'cpau',     label: 'CPAU Registrado',     desc: 'Consejo Profesional de Arquitectura' },
    { id: 'cpic',     label: 'CPIC Registrado',     desc: 'Consejo Profes. Ingeniería Civil' },
    { id: 'iso9001',  label: 'ISO 9001',            desc: 'Gestión de Calidad' },
    { id: 'ibnorca',  label: 'IBNORCA',             desc: 'Norma Técnica Argentina' },
  ],
  México: [
    { id: 'scip_mx',  label: 'SCIP Certificado',   desc: 'Certificación oficial SCIP WORLD' },
    { id: 'onncce',   label: 'ONNCCE',              desc: 'Norma Mexicana de Construcción' },
    { id: 'cicm',     label: 'CICM Registrado',     desc: 'Colegio de Ingenieros Civiles' },
    { id: 'cai',      label: 'CAI Registrado',      desc: 'Colegio de Arquitectos' },
    { id: 'iso9001',  label: 'ISO 9001',            desc: 'Gestión de Calidad' },
  ],
  Colômbia: [
    { id: 'scip_co',  label: 'SCIP Certificado',   desc: 'Certificación oficial SCIP WORLD' },
    { id: 'icontec',  label: 'ICONTEC',             desc: 'Norma Técnica Colombiana' },
    { id: 'copnia',   label: 'COPNIA Registrado',   desc: 'Consejo Profes. Ingeniería' },
    { id: 'sic',      label: 'SIC Certificado',     desc: 'Superintendencia de Industria' },
    { id: 'iso9001',  label: 'ISO 9001',            desc: 'Gestión de Calidad' },
  ],
  Internacional: [
    { id: 'scip_int', label: 'SCIP Certified',      desc: 'SCIP WORLD Official Certification' },
    { id: 'iso9001',  label: 'ISO 9001',            desc: 'Quality Management' },
    { id: 'iso14001', label: 'ISO 14001',           desc: 'Environmental Management' },
    { id: 'ohsas',    label: 'ISO 45001',           desc: 'Occupational Safety' },
  ],
};

function detectCountry(location: string): string {
  const loc = location.toLowerCase();
  const brStates = /\b(sp|rj|mg|ba|rs|pr|sc|ce|pe|go|df|es|am|pa|ac|al|ap|ma|ms|mt|pb|pi|rn|ro|rr|se|to)\b/;
  if (loc.includes('brasil') || loc.includes('brazil') || brStates.test(loc)) return 'Brasil';
  if (loc.includes('eua') || loc.includes('usa') || loc.includes('united states') ||
      /\b(fl|ny|ca|tx|wa|co|ga|nc|va|az|oh|mi|il|miami|orlando|houston|dallas)\b/.test(loc)) return 'EUA';
  if (loc.includes('argentina') || loc.includes('buenos aires') || loc.includes('córdoba') || loc.includes('rosario')) return 'Argentina';
  if (loc.includes('mexico') || loc.includes('méxico') || loc.includes('cdmx') || loc.includes('guadalajara')) return 'México';
  if (loc.includes('colombia') || loc.includes('colômbia') || loc.includes('bogotá') || loc.includes('bogota')) return 'Colômbia';
  return 'Internacional';
}

const COUNTRY_FLAGS: Record<string, string> = {
  Brasil: '🇧🇷', EUA: '🇺🇸', Argentina: '🇦🇷', México: '🇲🇽', Colômbia: '🇨🇴', Internacional: '🌍',
};

const SERVICE_SUGGESTIONS = [
  'Alvenaria SCIP', 'Projetos Estruturais', 'Fundações', 'Reforma',
  'Projetos 3D', 'Consultoria Técnica', 'Laudos Técnicos',
  'Design de Interiores', 'Painéis Pré-fabricados', 'Construção Sustentável',
];

// ─── Preview Card ─────────────────────────────────────────────────────────────
function PreviewCard({ name, category, location, logoColor, logoInitial, logoImage, coverImage, services }: {
  name: string; category: string; location: string;
  logoColor: string; logoInitial: string; logoImage: string; coverImage: string; services: string[];
}) {
  return (
    <View style={pv.card}>
      <ImageBackground source={{ uri: coverImage }} style={pv.cover} resizeMode="cover">
        <Grad colors={['rgba(4,8,15,0.65)', 'rgba(4,8,15,0.5)']} style={StyleSheet.absoluteFill} />
        <View style={pv.row}>
          <View style={[pv.logo, { backgroundColor: logoColor + '28', borderColor: logoColor + '70' }]}>
            {logoImage
              ? <Image source={{ uri: logoImage }} style={StyleSheet.absoluteFill as any} resizeMode="cover" />
              : <Text style={[pv.logoText, { color: logoColor }]}>{logoInitial || 'A'}</Text>
            }
          </View>
          <View style={{ flex: 1 }}>
            <Text style={pv.name} numberOfLines={1}>{name || 'Nome do negócio'}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
              <Ionicons name="location-outline" size={10} color={Colors.textMuted} />
              <Text style={pv.location} numberOfLines={1}>{location || 'Cidade, Estado'}</Text>
            </View>
          </View>
          <View style={pv.catBadge}>
            <Text style={pv.catText}>{category || 'Categoria'}</Text>
          </View>
        </View>
      </ImageBackground>
      {services.length > 0 && (
        <View style={pv.tags}>
          {services.slice(0, 3).map((s) => (
            <View key={s} style={pv.tag}><Text style={pv.tagText}>{s}</Text></View>
          ))}
          {services.length > 3 && (
            <View style={pv.tag}><Text style={pv.tagText}>+{services.length - 3}</Text></View>
          )}
        </View>
      )}
    </View>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ icon, label }: { icon: string; label: string }) {
  return (
    <View style={s.sectionHeader}>
      <Ionicons name={icon as any} size={14} color={Colors.cyan} />
      <Text style={s.sectionTitle}>{label}</Text>
    </View>
  );
}

// ─── Field ────────────────────────────────────────────────────────────────────
function Field({ label, ionicon, color, placeholder, value, onChangeText, keyboardType, autoCapitalize, multiline }: any) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={s.fieldLabel}>{label}</Text>
      <View style={[s.inputWrap, multiline && { height: 90, alignItems: 'flex-start', paddingTop: 12 }]}>
        <View style={[s.iconBox, { backgroundColor: color + '18' }]}>
          <Ionicons name={ionicon} size={15} color={color} />
        </View>
        <TextInput
          style={[s.inputText, { flex: 1 }, multiline && { textAlignVertical: 'top', paddingTop: 0 }]}
          placeholder={placeholder}
          placeholderTextColor={Colors.textFaded}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize ?? 'words'}
          multiline={multiline}
        />
      </View>
    </View>
  );
}

// ─── Add Project Modal inline ─────────────────────────────────────────────────
function AddProjectForm({ onAdd, onCancel }: { onAdd: (p: CompanyProject) => void; onCancel: () => void }) {
  const [title, setTitle]       = useState('');
  const [desc,  setDesc]        = useState('');
  const [area,  setArea]        = useState('');
  const [img,   setImg]         = useState(PROJECT_IMG_PRESETS[0]);

  const handleAdd = () => {
    if (title.trim().length < 2) { Alert.alert('Erro', 'Informe o título do projeto.'); return; }
    onAdd({
      id: Math.random().toString(36).slice(2),
      title: title.trim(),
      description: desc.trim(),
      area: area.trim(),
      type: 'Residencial',
      image: img,
    });
  };

  return (
    <View style={s.addProjectForm}>
      <Grad colors={['rgba(10,28,61,0.98)', 'rgba(4,8,15,0.98)']} style={StyleSheet.absoluteFill} borderRadius={16} />

      <Text style={s.addProjectTitle}>Novo Projeto</Text>

      {/* Image picker */}
      <Text style={s.fieldLabel}>Foto do projeto</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', gap: 8, paddingRight: 4 }}>
          {PROJECT_IMG_PRESETS.map((uri) => (
            <TouchableOpacity key={uri} onPress={() => setImg(uri)} activeOpacity={0.85}
              style={[s.projThumb, img === uri && s.projThumbActive]}>
              <ImageBackground source={{ uri }} style={StyleSheet.absoluteFill as any} resizeMode="cover" imageStyle={{ borderRadius: 10 }} />
              {img === uri && (
                <View style={s.projThumbCheck}>
                  <Ionicons name="checkmark" size={12} color={Colors.white} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Field label="Título *"         ionicon="bookmark-outline"  color={Colors.cyan}   placeholder="Ex: Residência Moderne"  value={title} onChangeText={setTitle} />
      <Field label="Área construída"  ionicon="expand-outline"    color={Colors.blue}   placeholder="Ex: 320 m²"              value={area}  onChangeText={setArea} />
      <Field label="Descrição"        ionicon="document-outline"  color={Colors.purple} placeholder="Breve descrição..."     value={desc}  onChangeText={setDesc} multiline />

      <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
        <TouchableOpacity style={s.addProjectCancelBtn} onPress={onCancel} activeOpacity={0.8}>
          <Text style={s.addProjectCancelText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.addProjectConfirmBtn} onPress={handleAdd} activeOpacity={0.88}>
          <Grad colors={Colors.gradients.tech} style={StyleSheet.absoluteFill} borderRadius={12} />
          <Text style={s.addProjectConfirmText}>Adicionar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function BusinessSetupScreen() {
  const insets     = useSafeAreaInsets();
  const navigation = useNavigation<NavProp>();
  const route      = useRoute<RouteP>();
  const { saveCompany, addProject, updateUser, user } = useAuth();

  const { initialName = '', initialRole = '', initialCity = '', initialPhone = '' } = route.params ?? {};

  const [name,          setName]          = useState(initialName);
  const [category,      setCategory]      = useState(
    CATEGORIES.find(c => c.label === initialRole || initialRole.includes(c.label))?.label ?? CATEGORIES[0].label
  );
  const [location,      setLocation]      = useState(initialCity);
  const [phone,         setPhone]         = useState(initialPhone);
  const [website,       setWebsite]       = useState('');
  const [yearsExp,      setYearsExp]      = useState('');
  const [description,   setDescription]   = useState('');
  const [services,      setServices]      = useState<string[]>([]);
  const [newService,    setNewService]    = useState('');
  const [logoColor,     setLogoColor]     = useState(LOGO_COLORS[0]);
  const [logoImage,     setLogoImage]     = useState('');
  const [coverImage,    setCoverImage]    = useState(COVER_PRESETS[0]);
  const [projects,      setProjects]      = useState<CompanyProject[]>([]);
  const [selectedCerts,   setSelectedCerts]   = useState<string[]>(['SCIP Certificado', 'SCIP Certified']);
  const [certDocs,        setCertDocs]        = useState<Record<string, { text: string; confirmed: boolean }>>({});
  const [activeCertInput, setActiveCertInput] = useState<string | null>(null);
  const [showCatMenu,   setShowCatMenu]   = useState(false);
  const [showAddProject,setShowAddProject]= useState(false);
  const [loading,       setLoading]       = useState(false);

  const logoInitial = name.trim() ? name.trim()[0].toUpperCase() : 'A';

  const addService = (sv: string) => {
    const clean = sv.trim();
    if (!clean || services.includes(clean)) return;
    setServices((prev) => [...prev, clean]);
    setNewService('');
  };

  const handleAddProject = (p: CompanyProject) => {
    setProjects((prev) => [p, ...prev]);
    setShowAddProject(false);
  };

  const handlePublish = async () => {
    if (name.trim().length < 2) {
      Alert.alert('Campo obrigatório', 'Informe o nome do negócio para continuar.');
      return;
    }

    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 700));

      const company: MyCompany = {
        id: Math.random().toString(36).slice(2),
        name: name.trim(),
        rating: 0,
        reviewCount: 0,
        location: location.trim() || user?.location || 'Brasil',
        verified: false,
        category,
        services,
        description: description.trim() || `${name.trim()} — especializada em ${category} com tecnologia SCIP.`,
        coverImage,
        logoColor,
        logoInitial,
        logoImage:       logoImage.trim() || undefined,
        website:         website.trim()   || undefined,
        yearsExperience: yearsExp.trim()  || undefined,
        certifications:  selectedCerts.length > 0 ? selectedCerts : undefined,
        phone: phone.trim(),
        profileViews: 0,
      };

      saveCompany(company);
      projects.forEach((p) => addProject(p));
      updateUser({ role: category, location: company.location });
      setLoading(false);

      // Pequeno delay para o estado ser commitado antes de navegar
      setTimeout(() => navigation.replace('Profile'), 100);
    } catch (e) {
      setLoading(false);
      Alert.alert('Erro', 'Não foi possível publicar. Tente novamente.');
    }
  };

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <Grad colors={Colors.gradients.background} style={StyleSheet.absoluteFill} />

      {/* Top bar */}
      <View style={[s.topBar, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={20} color={Colors.white} />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={s.topTitle}>Configurar Negócio</Text>
          <Text style={s.topSub}>Seus dados aparecem para clientes</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={[s.scroll, { paddingTop: insets.top + 68, paddingBottom: insets.bottom + 220 }]}
        >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View>
          {/* Prévia */}
          <View style={{ gap: 6 }}>
            <Text style={s.previewLabel}>PRÉVIA DO SEU PERFIL</Text>
            <PreviewCard
              name={name} category={category} location={location}
              logoColor={logoColor} logoInitial={logoInitial}
              logoImage={logoImage} coverImage={coverImage} services={services}
            />
          </View>

          {/* ── IDENTIDADE VISUAL ── */}
          <View style={s.card}>
            <SectionHeader icon="color-palette-outline" label="IDENTIDADE VISUAL" />

            {/* Logo */}
            <View style={s.logoRow}>
              <View style={[s.logoPreview, { backgroundColor: logoColor + '22', borderColor: logoColor }]}>
                {logoImage
                  ? <Image source={{ uri: logoImage }} style={StyleSheet.absoluteFill as any} resizeMode="cover" />
                  : <Text style={[s.logoPreviewText, { color: logoColor }]}>{logoInitial || 'A'}</Text>
                }
              </View>
              <View style={{ flex: 1, gap: 10 }}>
                <Text style={s.fieldLabel}>Cor da logo</Text>
                <View style={s.colorsRow}>
                  {LOGO_COLORS.map((c) => (
                    <TouchableOpacity key={c} onPress={() => setLogoColor(c)} activeOpacity={0.8}
                      style={[s.colorDot, { backgroundColor: c }, logoColor === c && s.colorDotActive]}>
                      {logoColor === c && <Ionicons name="checkmark" size={12} color="#fff" />}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* Logo URL */}
            <Field
              label="URL da logo (opcional)"
              ionicon="image-outline"
              color={Colors.purple}
              placeholder="https://suaempresa.com/logo.png"
              value={logoImage}
              onChangeText={setLogoImage}
              autoCapitalize="none"
            />

            {/* Capa */}
            <Text style={s.fieldLabel}>Imagem de capa</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: 'row', gap: 8, paddingRight: 4 }}>
                {COVER_PRESETS.map((uri) => (
                  <TouchableOpacity key={uri} onPress={() => setCoverImage(uri)} activeOpacity={0.85}
                    style={[s.coverThumb, coverImage === uri && s.coverThumbActive]}>
                    <ImageBackground source={{ uri }} style={StyleSheet.absoluteFill as any} resizeMode="cover" />
                    {coverImage === uri && (
                      <View style={s.coverCheck}>
                        <Ionicons name="checkmark" size={13} color={Colors.white} />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* ── INFORMAÇÕES BÁSICAS ── */}
          <View style={s.card}>
            <SectionHeader icon="business-outline" label="INFORMAÇÕES BÁSICAS" />

            <Field label="Nome do negócio *"    ionicon="business-outline"  color={Colors.cyan}   placeholder="Ex: Construtora Silva & Filhos" value={name}     onChangeText={setName} />

            {/* Categoria */}
            <Text style={s.fieldLabel}>Categoria *</Text>
            <TouchableOpacity style={s.inputWrap} onPress={() => setShowCatMenu(!showCatMenu)} activeOpacity={0.8}>
              {(() => {
                const cat = CATEGORIES.find(c => c.label === category) ?? CATEGORIES[0];
                return <View style={[s.iconBox, { backgroundColor: cat.color + '18' }]}><Ionicons name={cat.ionicon as any} size={15} color={cat.color} /></View>;
              })()}
              <Text style={[s.inputText, { color: Colors.white, flex: 1 }]}>{category}</Text>
              <Ionicons name={showCatMenu ? 'chevron-up' : 'chevron-down'} size={14} color={Colors.textDim} />
            </TouchableOpacity>
            {showCatMenu && (
              <View style={s.catDropdown}>
                <Grad colors={['rgba(11,28,61,0.99)', 'rgba(4,8,15,0.99)']} style={StyleSheet.absoluteFill} borderRadius={14} />
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity key={cat.label} style={s.catOption}
                    onPress={() => { setCategory(cat.label); setShowCatMenu(false); }} activeOpacity={0.8}>
                    <View style={[s.iconBox, { backgroundColor: cat.color + '18' }]}><Ionicons name={cat.ionicon as any} size={14} color={cat.color} /></View>
                    <Text style={[s.catOptionText, category === cat.label && { color: Colors.amber }]}>{cat.label}</Text>
                    {category === cat.label && <Ionicons name="checkmark" size={14} color={Colors.amber} />}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <Field label="Cidade / Estado *"    ionicon="location-outline"  color={Colors.purple} placeholder="Ex: São Paulo, SP"              value={location} onChangeText={setLocation} />
            {/* Certificações dinâmicas por país */}
            {location.trim().length >= 3 && (() => {
              const country = detectCountry(location);
              const certs   = CERTS_BY_COUNTRY[country] ?? CERTS_BY_COUNTRY['Internacional'];
              const flag    = COUNTRY_FLAGS[country];
              const toggleCert = (label: string) => {
                setSelectedCerts((prev) =>
                  prev.includes(label) ? prev.filter((c) => c !== label) : [...prev, label]
                );
              };
              return (
                <View style={{ marginBottom: 4 }}>
                  <View style={s.certHeader}>
                    <Ionicons name="ribbon-outline" size={14} color={Colors.amber} />
                    <Text style={s.certHeaderText}>CERTIFICAÇÕES · {flag} {country.toUpperCase()}</Text>
                  </View>
                  <Text style={[s.fieldLabel, { marginBottom: 10 }]}>
                    Selecione as certificações que sua empresa possui
                  </Text>
                  <View style={s.certsGrid}>
                    {certs.map((cert) => {
                      const active = selectedCerts.includes(cert.label);
                      return (
                        <TouchableOpacity
                          key={cert.id}
                          style={[s.certChip, active && s.certChipActive]}
                          onPress={() => toggleCert(cert.label)}
                          activeOpacity={0.8}
                        >
                          {active && (
                            <Grad colors={['rgba(255,179,0,0.15)', 'rgba(255,107,0,0.08)']} style={StyleSheet.absoluteFill} borderRadius={12} />
                          )}
                          <View style={[s.certChipDot, active && s.certChipDotActive]} />
                          <View style={{ flex: 1 }}>
                            <Text style={[s.certChipLabel, active && s.certChipLabelActive]}>{cert.label}</Text>
                            <Text style={s.certChipDesc}>{cert.desc}</Text>
                          </View>
                          {active && <Ionicons name="checkmark-circle" size={16} color={Colors.amber} />}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              );
            })()}

            <Field label="WhatsApp comercial"   ionicon="logo-whatsapp"     color="#25D366"       placeholder="+55 11 99999-0000"              value={phone}    onChangeText={setPhone}    keyboardType="phone-pad" />
            <Field label="Website (opcional)"   ionicon="globe-outline"     color={Colors.blue}   placeholder="www.seusite.com.br"            value={website}  onChangeText={setWebsite}  autoCapitalize="none" />
            <Field label="Anos de experiência"  ionicon="time-outline"      color={Colors.amber}  placeholder="Ex: 10+"                        value={yearsExp} onChangeText={setYearsExp} keyboardType="default" />
          </View>

          {/* ── COMPROVANTES DE CERTIFICAÇÃO ── */}
          {selectedCerts.filter(c => !c.startsWith('SCIP')).length > 0 && (
            <View style={s.card}>
              <SectionHeader icon="shield-checkmark-outline" label="COMPROVANTES DE CERTIFICAÇÃO" />
              <Text style={[s.fieldLabel, { marginBottom: 8 }]}>
                Envie um link ou descreva o documento de cada certificação. Nossa equipe analisa em até 48h e adiciona um selo de verificado ao seu perfil.
              </Text>

              {selectedCerts.filter(c => !c.startsWith('SCIP')).map((certLabel) => {
                const doc      = certDocs[certLabel];
                const isEditing = activeCertInput === certLabel;
                return (
                  <View key={certLabel} style={s.docBlock}>
                    <View style={s.docRow}>
                      <View style={s.docRowLeft}>
                        <View style={s.docIconBox}>
                          <Ionicons name="ribbon-outline" size={13} color={Colors.amber} />
                        </View>
                        <Text style={s.docLabel} numberOfLines={1}>{certLabel}</Text>
                      </View>
                      {doc?.confirmed ? (
                        <View style={s.docBadge}>
                          <Ionicons name="checkmark-circle" size={12} color={Colors.cyan} />
                          <Text style={s.docBadgeText}>Enviado</Text>
                        </View>
                      ) : (
                        <TouchableOpacity
                          style={s.docAttachBtn}
                          onPress={() => setActiveCertInput(isEditing ? null : certLabel)}
                          activeOpacity={0.8}
                        >
                          <Ionicons name={isEditing ? 'close-outline' : 'attach-outline'} size={13} color={Colors.amber} />
                          <Text style={s.docAttachText}>{isEditing ? 'Cancelar' : 'Anexar'}</Text>
                        </TouchableOpacity>
                      )}
                    </View>

                    {isEditing && (
                      <View style={s.docInputArea}>
                        <Grad colors={['rgba(255,179,0,0.05)', 'rgba(4,8,15,0.4)']} style={StyleSheet.absoluteFill} borderRadius={12} />
                        <Text style={[s.fieldLabel, { marginBottom: 6 }]}>
                          Link do documento (Google Drive, site oficial, etc.)
                        </Text>
                        <View style={[s.inputWrap, { marginBottom: 8 }]}>
                          <View style={[s.iconBox, { backgroundColor: Colors.amber + '15' }]}>
                            <Ionicons name="link-outline" size={15} color={Colors.amber} />
                          </View>
                          <TextInput
                            style={[s.inputText, { flex: 1 }]}
                            placeholder="Ex: drive.google.com/doc... ou nº de registro"
                            placeholderTextColor={Colors.textFaded}
                            value={certDocs[certLabel]?.text ?? ''}
                            onChangeText={(v) =>
                              setCertDocs((prev) => ({ ...prev, [certLabel]: { text: v, confirmed: false } }))
                            }
                            autoCapitalize="none"
                            returnKeyType="done"
                          />
                        </View>
                        <TouchableOpacity
                          style={s.docConfirmBtn}
                          activeOpacity={0.88}
                          onPress={() => {
                            const text = certDocs[certLabel]?.text?.trim() ?? '';
                            if (text.length < 3) {
                              Alert.alert('Campo vazio', 'Informe o link ou número de registro do documento.');
                              return;
                            }
                            setCertDocs((prev) => ({ ...prev, [certLabel]: { text, confirmed: true } }));
                            setActiveCertInput(null);
                          }}
                        >
                          <Grad colors={Colors.gradients.tech} style={StyleSheet.absoluteFill} borderRadius={10} />
                          <Ionicons name="cloud-upload-outline" size={14} color={Colors.white} />
                          <Text style={s.docConfirmText}>Confirmar envio</Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    {doc?.confirmed && (
                      <Text style={s.docConfirmedNote} numberOfLines={1}>
                        📎 {doc.text}
                      </Text>
                    )}
                  </View>
                );
              })}

              <View style={s.docDisclaimer}>
                <Ionicons name="lock-closed-outline" size={12} color={Colors.textDim} />
                <Text style={s.docDisclaimerText}>
                  Documentos são confidenciais e usados exclusivamente para verificação de autenticidade pelo time SCIP WORLD.
                </Text>
              </View>
            </View>
          )}

          {/* ── SOBRE O NEGÓCIO ── */}
          <View style={s.card}>
            <SectionHeader icon="document-text-outline" label="SOBRE O NEGÓCIO" />
            <Text style={s.fieldLabel}>Descrição * <Text style={s.charCount}>{description.length}/300</Text></Text>
            <View style={[s.inputWrap, { height: 110, alignItems: 'flex-start', paddingTop: 12 }]}>
              <TextInput
                style={[s.inputText, { flex: 1, textAlignVertical: 'top', paddingTop: 0 }]}
                placeholder="Conte sobre sua empresa, experiência, diferenciais e como o sistema SCIP faz parte do seu trabalho..."
                placeholderTextColor={Colors.textFaded}
                value={description}
                onChangeText={(v) => v.length <= 300 && setDescription(v)}
                multiline
              />
            </View>
          </View>

          {/* ── SERVIÇOS ── */}
          <View style={s.card}>
            <SectionHeader icon="list-outline" label="SERVIÇOS OFERECIDOS" />
            <Text style={s.fieldLabel}>Sugestões rápidas</Text>
            <View style={s.suggestionsWrap}>
              {SERVICE_SUGGESTIONS.filter(sg => !services.includes(sg)).map((sg) => (
                <TouchableOpacity key={sg} style={s.suggestion} onPress={() => addService(sg)} activeOpacity={0.7}>
                  <Ionicons name="add" size={12} color={Colors.cyan} />
                  <Text style={s.suggestionText}>{sg}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[s.fieldLabel, { marginTop: 12 }]}>Adicionar serviço</Text>
            <View style={s.addServiceRow}>
              <View style={[s.inputWrap, { flex: 1 }]}>
                <View style={[s.iconBox, { backgroundColor: Colors.cyan + '18' }]}>
                  <Ionicons name="add-circle-outline" size={15} color={Colors.cyan} />
                </View>
                <TextInput
                  style={[s.inputText, { flex: 1 }]}
                  placeholder="Ex: Vistorias Técnicas"
                  placeholderTextColor={Colors.textFaded}
                  value={newService}
                  onChangeText={setNewService}
                  onSubmitEditing={() => addService(newService)}
                  returnKeyType="done"
                />
              </View>
              <TouchableOpacity style={s.addBtn} onPress={() => addService(newService)} activeOpacity={0.8}>
                <Grad colors={Colors.gradients.tech} style={StyleSheet.absoluteFill} borderRadius={12} />
                <Ionicons name="add" size={20} color={Colors.white} />
              </TouchableOpacity>
            </View>

            {services.length > 0 && (
              <View style={s.selectedServices}>
                {services.map((sv) => (
                  <View key={sv} style={s.serviceChip}>
                    <Grad colors={['rgba(10,132,255,0.12)', 'rgba(123,97,255,0.08)']} style={StyleSheet.absoluteFill} borderRadius={20} />
                    <Text style={s.serviceChipText}>{sv}</Text>
                    <TouchableOpacity onPress={() => setServices((p) => p.filter((x) => x !== sv))} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
                      <Ionicons name="close" size={13} color={Colors.textDim} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* ── PROJETOS ── */}
          <View style={s.card}>
            <SectionHeader icon="images-outline" label="PROJETOS DO PORTFÓLIO" />
            <Text style={[s.fieldLabel, { marginBottom: 12 }]}>
              Adicione fotos e descrições dos seus projetos. Isso aumenta a confiança dos clientes.
            </Text>

            {/* Lista de projetos adicionados */}
            {projects.map((proj) => (
              <View key={proj.id} style={s.projectCard}>
                <ImageBackground source={{ uri: proj.image }} style={s.projectCardImg} resizeMode="cover" imageStyle={{ borderRadius: 12 }}>
                  <Grad colors={['rgba(4,8,15,0)', 'rgba(4,8,15,0.85)']} style={StyleSheet.absoluteFill} />
                  <TouchableOpacity
                    style={s.projectRemoveBtn}
                    onPress={() => setProjects((p) => p.filter((x) => x.id !== proj.id))}
                    hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                  >
                    <Ionicons name="close-circle" size={22} color="rgba(255,77,77,0.9)" />
                  </TouchableOpacity>
                  <View style={s.projectCardInfo}>
                    <Text style={s.projectCardTitle} numberOfLines={1}>{proj.title}</Text>
                    {proj.area ? <Text style={s.projectCardArea}>{proj.area}</Text> : null}
                  </View>
                </ImageBackground>
                {proj.description ? (
                  <Text style={s.projectCardDesc} numberOfLines={2}>{proj.description}</Text>
                ) : null}
              </View>
            ))}

            {/* Form de adição inline */}
            {showAddProject ? (
              <AddProjectForm
                onAdd={handleAddProject}
                onCancel={() => setShowAddProject(false)}
              />
            ) : (
              <TouchableOpacity style={s.addProjectBtn} onPress={() => setShowAddProject(true)} activeOpacity={0.85}>
                <Grad colors={['rgba(10,132,255,0.08)', 'rgba(123,97,255,0.05)']} style={StyleSheet.absoluteFill} borderRadius={14} />
                <Ionicons name="add-circle-outline" size={22} color={Colors.cyan} />
                <Text style={s.addProjectBtnText}>Adicionar Projeto</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* ── PUBLICAR ── */}
          <TouchableOpacity style={s.publishBtn} onPress={handlePublish} activeOpacity={0.88} disabled={loading}>
            <Grad colors={Colors.gradients.tech} style={StyleSheet.absoluteFill} borderRadius={16} />
            {loading
              ? <Text style={s.publishBtnText}>Publicando...</Text>
              : (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Ionicons name="rocket-outline" size={18} color={Colors.white} />
                  <Text style={s.publishBtnText}>Publicar Perfil</Text>
                </View>
              )
            }
          </TouchableOpacity>

          <Text style={s.publishNote}>
            Apenas o nome do negócio é obrigatório. Você pode completar as demais informações depois.
          </Text>
        </View>
        </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// ─── Preview styles ───────────────────────────────────────────────────────────
const pv = StyleSheet.create({
  card:    { borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  cover:   { height: 110, justifyContent: 'flex-end', padding: 12 },
  row:     { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logo:    { width: 44, height: 44, borderRadius: 12, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  logoText:{ fontFamily: 'Inter_700Bold', fontSize: 18 },
  name:    { fontFamily: 'Inter_700Bold', fontSize: 15, color: Colors.white },
  location:{ fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.textMuted },
  catBadge:{ borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3, backgroundColor: Colors.cyan + '20', borderWidth: 1, borderColor: Colors.cyan + '40' },
  catText: { fontFamily: 'Inter_500Medium', fontSize: 10, color: Colors.cyan },
  tags:    { flexDirection: 'row', flexWrap: 'wrap', gap: 6, padding: 12, backgroundColor: 'rgba(7,13,26,0.98)' },
  tag:     { backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  tagText: { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.textMuted },
});

// ─── Main styles ──────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root:  { flex: 1, backgroundColor: Colors.bgDeep },
  topBar:{
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100,
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingBottom: 12,
    backgroundColor: 'rgba(4,8,15,0.94)',
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  backBtn:{ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.06)' },
  topTitle:{ fontFamily: 'Inter_700Bold', fontSize: 15, color: Colors.white },
  topSub:  { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.textMuted, marginTop: 1 },
  scroll:  { paddingHorizontal: 16, gap: 16 },
  previewLabel: { fontFamily: 'Inter_400Regular', fontSize: 10, color: Colors.textDim, letterSpacing: 1.2 },

  card: {
    borderRadius: 20, padding: 18,
    backgroundColor: 'rgba(6,12,30,0.9)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
    gap: 12,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  sectionTitle:  { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: Colors.cyan, letterSpacing: 1.2 },
  fieldLabel:    { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.textMuted, marginBottom: 6 },
  charCount:     { color: Colors.textDim, fontSize: 10 },

  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12, height: 50, gap: 10,
  },
  inputText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.white, padding: 0 },
  iconBox:   { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },

  // Logo
  logoRow:        { flexDirection: 'row', alignItems: 'center', gap: 16 },
  logoPreview:    { width: 64, height: 64, borderRadius: 16, borderWidth: 2, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  logoPreviewText:{ fontFamily: 'Inter_700Bold', fontSize: 26, zIndex: 1 },
  colorsRow:      { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  colorDot:       { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  colorDotActive: { borderWidth: 2.5, borderColor: Colors.white },

  // Cover
  coverThumb:      { width: 88, height: 56, borderRadius: 10, overflow: 'hidden', borderWidth: 2, borderColor: 'transparent' },
  coverThumbActive:{ borderColor: Colors.cyan },
  coverCheck:      { position: 'absolute', top: 4, right: 4, width: 20, height: 20, borderRadius: 10, backgroundColor: Colors.cyan, alignItems: 'center', justifyContent: 'center' },

  // Category
  catDropdown: { borderRadius: 14, overflow: 'hidden', marginTop: -4, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  catOption:   { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  catOptionText:{ flex: 1, fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.white, zIndex: 1 },

  // Services
  suggestionsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  suggestion:      { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: 'rgba(10,132,255,0.08)', borderWidth: 1, borderColor: 'rgba(10,132,255,0.2)' },
  suggestionText:  { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.cyan },
  addServiceRow:   { flexDirection: 'row', gap: 8 },
  addBtn:          { width: 50, height: 50, borderRadius: 12, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  selectedServices:{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  serviceChip:     { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(10,132,255,0.25)' },
  serviceChipText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.white, zIndex: 1 },

  // Projects
  projectCard:      { marginBottom: 12 },
  projectCardImg:   { height: 140, borderRadius: 12, justifyContent: 'flex-end', padding: 10, overflow: 'hidden' },
  projectRemoveBtn: { position: 'absolute', top: 8, right: 8 },
  projectCardInfo:  { gap: 2 },
  projectCardTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.white },
  projectCardArea:  { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.textMuted },
  projectCardDesc:  { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.textMuted, marginTop: 6, lineHeight: 17 },
  addProjectBtn:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 52, borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(10,132,255,0.2)', borderStyle: 'dashed' },
  addProjectBtnText:{ fontFamily: 'Inter_500Medium', fontSize: 14, color: Colors.cyan },

  // Add project form
  addProjectForm:   { borderRadius: 16, padding: 16, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', gap: 0 },
  addProjectTitle:  { fontFamily: 'Inter_700Bold', fontSize: 15, color: Colors.white, marginBottom: 14 },
  projThumb:        { width: 80, height: 52, borderRadius: 10, overflow: 'hidden', borderWidth: 2, borderColor: 'transparent' },
  projThumbActive:  { borderColor: Colors.cyan },
  projThumbCheck:   { position: 'absolute', top: 4, right: 4, width: 18, height: 18, borderRadius: 9, backgroundColor: Colors.cyan, alignItems: 'center', justifyContent: 'center' },
  addProjectCancelBtn: { flex: 1, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  addProjectCancelText:{ fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.textDim },
  addProjectConfirmBtn:{ flex: 1, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  addProjectConfirmText:{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.white, zIndex: 1 },

  // Certifications
  certHeader:        { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  certHeaderText:    { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: Colors.amber, letterSpacing: 1.2 },
  certsGrid:         { gap: 8 },
  certChip: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    overflow: 'hidden',
  },
  certChipActive:     { borderColor: 'rgba(255,179,0,0.35)' },
  certChipDot:        { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.15)', flexShrink: 0 },
  certChipDotActive:  { backgroundColor: Colors.amber },
  certChipLabel:      { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.textMuted },
  certChipLabelActive:{ color: Colors.white },
  certChipDesc:       { fontFamily: 'Inter_400Regular', fontSize: 10, color: Colors.textDim, marginTop: 1 },

  // Documents
  docBlock:          { gap: 6, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  docRow:            { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  docRowLeft:        { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1, marginRight: 8 },
  docIconBox:        { width: 26, height: 26, borderRadius: 7, backgroundColor: Colors.amber + '15', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  docLabel:          { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.white, flex: 1 },
  docBadge:          { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, backgroundColor: Colors.cyan + '15', borderWidth: 1, borderColor: Colors.cyan + '30' },
  docBadgeText:      { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.cyan },
  docAttachBtn:      { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, borderWidth: 1, borderColor: Colors.amber + '40', backgroundColor: Colors.amber + '10' },
  docAttachText:     { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.amber },
  docInputArea:      { borderRadius: 12, padding: 12, borderWidth: 1, borderColor: 'rgba(255,179,0,0.2)', overflow: 'hidden', marginTop: 4 },
  docConfirmBtn:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, height: 40, borderRadius: 10, overflow: 'hidden' },
  docConfirmText:    { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: Colors.white, zIndex: 1 },
  docConfirmedNote:  { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.textDim, paddingLeft: 34 },
  docDisclaimer:     { flexDirection: 'row', alignItems: 'flex-start', gap: 6, marginTop: 8, paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  docDisclaimerText: { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.textDim, flex: 1, lineHeight: 16 },

  // Publish
  publishBtn:     { height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginTop: 8 },
  publishBtnText: { fontFamily: 'Inter_700Bold', fontSize: 16, color: Colors.white, zIndex: 1 },
  publishNote:    { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.textDim, textAlign: 'center', lineHeight: 16 },
});
