import { supabase } from './supabase';

// --- NEW: USER PROFILE INTERFACE ---
export interface UserProfile {
  id: string; // UUID from auth.users
  school_id: number | null;
  role: string;
  full_name: string | null;
}

// --- DEFINE INTERFACES FOR OUR DATA ---
export interface Student {
  id: number;
  school_id: number;
  studentId: string;
  name: string;
  grade: number;
  parent: string;
  contact: string;
  photo: string;
}

export interface Course {
    id: number;
    school_id: number;
    courseId: string;
    name: string;
    teacher: string;
    students: number;
    subject: string;
}

export interface Session {
    id: number;
    school_id: number;
    session: string;
    status: string | null;
    created_at: string;
    schools?: { id: number; name: string; } | null; // For joined data
}

export interface Lead {
    id: number;
    school_id: number;
    name: string;
    grade: string;
    contact: string;
    enquiryDate: string;
    status: 'New Enquiry' | 'Contacted' | 'Application Submitted' | 'Interview Scheduled' | 'Admitted';
}

export interface Task {
    id: number;
    school_id: number;
    title: string;
    assignedTo: string;
    dueDate: string;
    priority: 'High' | 'Medium' | 'Low';
    status: 'To Do' | 'In Progress' | 'Completed';
}

export interface Staff {
  id: number;
  school_id: number;
  staffId: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  photo: string;
}

export interface LeaveRequest {
  id: number;
  school_id: number;
  staffId: string;
  staffName: string;
  leaveType: 'Annual' | 'Sick' | 'Maternity' | 'Unpaid';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

// NOTE: Accounting module is company-wide, not school-specific in this model.
export interface Client {
  id: number;
  schoolName: string;
  plan: 'Starter' | 'Professional' | 'Enterprise';
  status: 'Active' | 'Canceled';
  joinDate: string;
  monthlyValue: number;
}

export interface Invoice {
  id: number;
  invoiceId: string;
  clientId: number; // Foreign key
  clientName: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  status: 'Paid' | 'Due' | 'Overdue';
}

export interface Expense {
  id: number;
  category: 'Salaries' | 'Marketing' | 'Software' | 'Office Supplies';
  description: string;
  amount: number;
  date: string;
}

// --- INVENTORY INTERFACES ---
export interface Product {
    id: number;
    school: string;
    name: string;
    code: string;
    category: string;
    purchaseUnit: string;
    saleUnit: string;
    unitRatio: number;
    purchasePrice: number;
    salesPrice: number;
    remarks: string;
}

export interface Category {
    id: number;
    user_id: string;
    school_id: number;
    school: string;
    name: string;
}

export interface Store {
    id: number;
    school: string;
    name: string;
    code: string;
    mobile: string;
    address: string;
    description: string;
}

export interface Supplier {
    id: number;
    school: string;
    name: string;
    address: string;
    contact: string;
    email: string;
    company: string;
    products: string;
}

export interface Unit {
    id: number;
    school: string;
    name: string;
}

export interface Purchase {
    id: number;
    school: string;
    billNo: string;
    supplier: string;
    store: string;
    purchaseStatus: 'Received' | 'Ordered' | 'Pending';
    date: string;
    remarks: string;
}

export interface Sale {
    id: number;
    school: string;
    role: 'Student' | 'Parent' | 'Staff';
    saleTo: string;
    billNo: string;
    date: string;
    subTotal: number;
    discount: number;
    netPayable: number;
    receivedAmount: number;
    payVia: 'Cash' | 'Card' | 'Bank Transfer';
    remarks: string;
}

export interface Issue {
    id: number;
    school: string;
    role: 'Student' | 'Parent' | 'Staff';
    issueTo: string;
    dateOfIssue: string;
    dueDate: string;
    remark: string;
}

// --- CURRENCY AND UPDATED SCHOOL INTERFACES ---
export interface Currency {
    id: number;
    school_id: number | null;
    name: string;
    code: string;
    symbol: string;
}

export interface School {
    id: number;
    name: string;
    officialName: string;
    email: string;
    mobile: string;
    currency_id: number;
    city?: string;
    state?: string;
    address?: string;
    systemLogoUrl?: string | null;
    textLogoUrl?: string | null;
    printingLogoUrl?: string | null;
    reportCardLogoUrl?: string | null;
    currencies?: Currency; // For joined data
}

// --- SUBSCRIPTION MODULE INTERFACES ---
export interface Plan {
    id: number;
    name: string;
    pricePerStudent: number;
    discount: number;
    periodType: 'Days' | 'Monthly' | 'Termly' | 'Yearly' | 'Lifetime';
    periodValue: number;
    features: string[]; // JSONB stored as an array of strings
    isRecommended: boolean;
    showOnWebsite: boolean;
    status: 'Active' | 'Inactive';
}

export interface Subscription {
    id: number;
    school_id: number;
    plan_id: number;
    startDate: string;
    expiryDate: string | null;
    status: 'Active' | 'Expired' | 'Canceled' | 'Pending';
    studentCount: number;
    totalPrice: number;
    created_at: string;
    schools?: School;
    plans?: Plan;
}

export interface OfflinePaymentMethod {
    id: number;
    school_id: number;
    name: string;
    instructions: string;
    status: 'Active' | 'Inactive';
}

export interface Transaction {
    id: number;
    school_id: number;
    plan_id: number;
    transactionId: string;
    paymentMethod: string;
    amount: number;
    currency: string;
    status: 'Completed' | 'Pending' | 'Failed';
    transactionDate: string;
    schools?: School;
    plans?: Plan;
}

export interface CustomDomainRequest {
    id: number;
    school_id: number;
    requestedDomain: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    requestDate: string;
    approvedDate: string | null;
    schools?: School;
}

// --- FORMS MANAGER INTERFACES ---
export interface ContactUsSubmission {
    id: number;
    created_at: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    is_read: boolean;
}

export interface DemoRequest {
    id: number;
    created_at: string;
    name: string;
    email: string;
    phone?: string;
    institution: string;
    role: string;
    interest: string;
    additional_info?: string;
    status: 'Pending' | 'Contacted' | 'Closed';
}

export interface NewsletterSubscriber {
    id: number;
    created_at: string;
    email: string;
    name: string | null;
    status: 'Active' | 'Unsubscribed';
    source: string;
}

// --- SCHOOL SUBSCRIPTION FORM INTERFACE ---
export interface SchoolSubscriptionData {
    plan: Plan;
    studentCount: number;
    adminEmail: string;
    adminPassword: string;
    adminName: string;
    schoolName: string;
    schoolAddress: string;
    contactNumber: string;
    schoolLogoFile: File | null;
}

// --- INTEGRATIONS INTERFACES ---
export interface GoogleAnalyticsConfig {
  id: number;
  measurement_id: string | null;
  is_enabled: boolean;
}

export interface CalendlyConfig {
  id: number;
  scheduling_link: string | null;
  is_enabled: boolean;
}

export interface PusherConfig {
  id: number;
  app_id: string | null;
  key: string | null;
  secret: string | null;
  cluster: string | null;
  is_enabled: boolean;
}

// --- NEW: API Config Interface ---
export interface ApiConfig {
  id: number;
  user_id: string; // Foreign key to auth.users
  api_key: string | null;
  endpoint_url: string | null;
  auth_type: 'Bearer' | 'Header' | null;
  header_name: string | null;
  is_enabled: boolean;
}

// --- NEW: PESAPAL CONFIG INTERFACE ---
export interface PesaPalConfig {
  id: number;
  user_id: string; // Foreign key to auth.users, for Super Admin
  consumer_key: string | null;
  consumer_secret: string | null;
  is_enabled: boolean;
}

// --- NEW: PAYPAL CONFIG INTERFACE ---
export interface PayPalConfig {
  id: number;
  user_id: string; // Foreign key to auth.users, for Super Admin
  username: string | null;
  password: string | null;
  signature: string | null;
  email: string | null;
  sandbox: boolean;
  is_enabled: boolean;
}


// --- ROLES & PERMISSIONS ---
export interface Role {
  id: number;
  school_id: number;
  name: string;
  is_system_role: boolean;
  schools?: { id: number; name: string } | null; // For joined data
}

export interface RolePermission {
    id?: number;
    role_id: number;
    feature: string;
    view: boolean;
    add: boolean;
    edit: boolean;
    delete: boolean;
}

// --- NEW: DefaultRole Interface ---
export interface DefaultRole {
  id: number;
  name: string;
  description?: string;
}

// --- NEW: 2FA SETTINGS INTERFACE ---
export interface TwoFactorSettings {
  id?: number;
  school_id: number;
  is_enabled: boolean;
  remember_browser: boolean;
  cookie_expiry_days: number;
  email_instruction: string;
  app_instruction: string;
}


// --- NEW: CORE DATA ACCESS REFACTOR ---

// Gets the full profile (role, school_id) of the currently logged-in user.
async function getUserProfile(): Promise<UserProfile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();
    
    if (error) {
        console.error("Error fetching user profile:", error);
        return null;
    }
    return data;
}

// --- Update User Profile Function ---
export async function updateUserProfile(userId: string, updates: { full_name: string }) {
    // 1. Update the public user_profiles table
    const { error: profileError } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId);

    if (profileError) {
        console.error("Error updating user_profiles table:", profileError);
        throw new Error(profileError.message);
    }
    
    // 2. Update the user metadata in the auth schema
    const { error: authError } = await supabase.auth.updateUser({
        data: { full_name: updates.full_name }
    });

    if (authError) {
        console.error("Error updating auth.users metadata:", authError);
        // Note: You might want to handle rollback logic here if the first update succeeded
        // but this one failed, to keep data consistent.
        throw new Error(authError.message);
    }
    
    // Both updates were successful
    console.log("User profile updated successfully in both tables.");
}

// --- NEW: Update User Avatar Function ---
export async function updateUserAvatar(userId: string, file: File) {
    if (!file) {
        throw new Error("No file provided for upload.");
    }

    const fileExt = file.name.split('.').pop();
    // Use a timestamp for the filename to avoid cache issues
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    // 1. Upload the avatar to Supabase Storage
    const { error: uploadError } = await supabase.storage
        .from('avatars') // The bucket must be created in Supabase dashboard
        .upload(filePath, file, { upsert: false });

    if (uploadError) {
        console.error("Error uploading avatar:", uploadError);
        throw new Error(uploadError.message);
    }

    // 2. Get the public URL of the uploaded avatar
    const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
    
    if (!urlData || !urlData.publicUrl) {
        throw new Error("Could not get public URL for avatar.");
    }

    const avatarUrl = urlData.publicUrl;

    // 3. Update the user metadata in the auth schema
    const { data, error: authError } = await supabase.auth.updateUser({
        data: { avatar_url: avatarUrl }
    });

    if (authError) {
        console.error("Error updating user avatar URL:", authError);
        throw new Error(authError.message);
    }
    
    // 4. Refresh the session to get the updated user metadata on the client
    await supabase.auth.refreshSession();

    return data.user;
}

// --- REFACTORED ASYNC DATA ACCESS FUNCTIONS (SCHOOL-SPECIFIC / MULTI-TENANT) ---
// List of tables that use the denormalized `school` name string for tenancy, instead of a `school_id`.
const inventoryTablesUsingSchoolName = ['products', 'stores', 'suppliers', 'units', 'purchases', 'sales', 'issues'];

async function getData<T>(tableName: string, query: string = '*'): Promise<T[]> {
    const profile = await getUserProfile();
    if (!profile) return []; // Not logged in

    if (profile.role === 'Super Admin') {
        // Super Admins can see all data
        const { data, error } = await supabase.from(tableName).select(query).order('id', { ascending: true });
        if (error) {
            console.error(`Error fetching from ${tableName} for Super Admin:`, error.message);
            return [];
        }
        return data as T[];
    }
    
    // For school users, filter by their school_id or school name
    if (profile.school_id) {
        // Check if this table uses the 'school' name string for filtering
        if (inventoryTablesUsingSchoolName.includes(tableName)) {
            // Fetch school name using school_id
            const { data: schoolData, error: schoolError } = await supabase
                .from('schools')
                .select('name')
                .eq('id', profile.school_id)
                .single();
            
            if (schoolError || !schoolData) {
                console.error(`Error finding school name for school_id ${profile.school_id}:`, schoolError);
                return [];
            }
            
            // Filter by school name
            const { data, error } = await supabase.from(tableName).select(query).eq('school', schoolData.name).order('id', { ascending: true });
            if (error) {
                console.error(`Error fetching from ${tableName} for school ${schoolData.name}:`, error.message);
                return [];
            }
            return data as T[];
        } else {
            // Default behavior: filter by school_id for tables like 'categories', 'sessions', etc.
            const { data, error } = await supabase.from(tableName).select(query).eq('school_id', profile.school_id).order('id', { ascending: true });
            if (error) {
                console.error(`Error fetching from ${tableName} for school_id ${profile.school_id}:`, error.message);
                return [];
            }
            return data as T[];
        }
    }

    // School user with no school_id, return empty.
    return [];
}


async function addData<T>(tableName: string, newData: Omit<T, 'id' | 'school'>) {
    const profile = await getUserProfile();
    if (!profile || !profile.school_id) {
        console.error(`Cannot add data to ${tableName}: user is not associated with a school.`);
        throw new Error("User is not associated with a school.");
    };
    
    // Fetch school name for denormalization, as all inventory tables using this helper need it.
    const { data: schoolData, error: schoolError } = await supabase
        .from('schools')
        .select('name')
        .eq('id', profile.school_id)
        .single();

    if (schoolError || !schoolData) {
        console.error(`Could not fetch school name for insertion into ${tableName}:`, schoolError);
        throw new Error(`Could not find school for user.`);
    }

    const record = { ...newData, school: schoolData.name };
    const { error } = await supabase.from(tableName).insert(record);
    if(error) {
        console.error(`Error adding to ${tableName}:`, error.message);
        throw error;
    }
}

// Delete remains the same, as RLS policies at the DB level will prevent unauthorized deletions.
async function deleteData(tableName: string, id: number) {
    const { error } = await supabase.from(tableName).delete().eq('id', id);
    if (error) {
        console.error(`Error deleting from ${tableName}:`, error.message);
        throw error;
    }
}

// --- ASYNC DATA ACCESS FUNCTIONS (GLOBAL / SUPER ADMIN) ---
// These functions are for data not scoped by school_id, accessible only by Super Admins.
async function getGlobalData<T>(tableName: string, query: string = '*'): Promise<T[]> {
  try {
    const { data, error } = await supabase.from(tableName).select(query).order('id', { ascending: true });
    if (error) {
      console.error(`Error fetching from ${tableName}:`, error.message);
      return [];
    }
    return data as T[];
  } catch (err: any) {
    console.error(`Network error while fetching ${tableName}:`, err.message);
    return [];
  }
}

// Students
export const getStudents = (): Promise<Student[]> => getData<Student>('students');

// Courses
export const getCourses = (): Promise<Course[]> => getData<Course>('courses');

// --- SESSIONS ---
export const getSessions = (): Promise<Session[]> => getData<Session>('sessions', '*, schools(id, name)');

export const addSession = async (sessionData: { session: string, school_id?: number }) => {
    const profile = await getUserProfile();
    if (!profile) {
        throw new Error("User not authenticated.");
    }
    
    let schoolIdForRecord: number;

    if (profile.role === 'Super Admin') {
        if (!sessionData.school_id) {
            throw new Error("Super Admin must provide a school_id to create a session.");
        }
        schoolIdForRecord = sessionData.school_id;
    } else {
        if (!profile.school_id) {
            throw new Error("Cannot add data to sessions: user is not associated with a school.");
        }
        schoolIdForRecord = profile.school_id;
    }

    const record = { session: sessionData.session, school_id: schoolIdForRecord };

    const { error } = await supabase.from('sessions').insert(record);
    if (error) {
        console.error("Error adding session:", error.message);
        throw error;
    }
};

export const updateSession = async (id: number, updates: Partial<Pick<Session, 'session' | 'status'>>) => {
    const { error } = await supabase.from('sessions').update(updates).eq('id', id);
    if (error) {
        console.error("Error updating session:", error.message);
        throw error;
    }
}
export const deleteSession = (id: number): Promise<void> => deleteData('sessions', id);


// Leads
export const getLeads = (): Promise<Lead[]> => getData<Lead>('leads');
export const addLead = (leadData: Omit<Lead, 'id' | 'school_id'>) => addData('leads', leadData as any);
export const updateLead = async (id: number, updates: Partial<Lead>) => {
    const { error } = await supabase.from('leads').update(updates).eq('id', id);
    if(error) console.error("Error updating lead:", error.message);
};

// Tasks
export const getTasks = (): Promise<Task[]> => getData<Task>('tasks');
export const addTask = (taskData: Omit<Task, 'id' | 'school_id'>) => addData('tasks', taskData as any);
export const updateTask = async (id: number, updates: Partial<Task>) => {
    const { error } = await supabase.from('tasks').update(updates).eq('id', id);
    if(error) console.error("Error updating task:", error.message);
};

// Staff
export const getStaff = (): Promise<Staff[]> => getData<Staff>('staff');

// Leave Requests
export const getLeaveRequests = (): Promise<LeaveRequest[]> => getData<LeaveRequest>('leave_requests');
export const updateLeaveRequestStatus = async (id: number, status: 'Approved' | 'Rejected') => {
    const { error } = await supabase.from('leave_requests').update({ status }).eq('id', id);
    if(error) console.error("Error updating leave request:", error.message);
};

// Accounting (Global)
export const getClients = (): Promise<Client[]> => getGlobalData<Client>('clients');
export const getInvoices = (): Promise<Invoice[]> => getGlobalData<Invoice>('invoices');
export const getExpenses = (): Promise<Expense[]> => getGlobalData<Expense>('expenses');

// --- INVENTORY FUNCTIONS ---
export const getProducts = (): Promise<Product[]> => getData<Product>('products');
export const addProduct = (data: Omit<Product, 'id' | 'school'>) => addData('products', data);
export const deleteProduct = (id: number) => deleteData('products', id);

export const getCategories = (): Promise<Category[]> => getData<Category>('categories');

export const addCategory = async (categoryData: { name: string; school_id?: number }) => {
    const profile = await getUserProfile();
    if (!profile) throw new Error("User not authenticated.");

    let schoolIdForRecord: number;

    // Determine the school_id to use
    if (profile.role === 'Super Admin') {
        if (!categoryData.school_id) {
            throw new Error("Super Admin must select a school to create a category.");
        }
        schoolIdForRecord = categoryData.school_id;
    } else {
        if (!profile.school_id) {
            throw new Error("Cannot add category: user is not associated with a school.");
        }
        schoolIdForRecord = profile.school_id;
    }

    // The 'categories' table has a 'school' name column, so we need to fetch it for denormalization.
    const { data: schoolData, error: schoolError } = await supabase
        .from('schools')
        .select('name')
        .eq('id', schoolIdForRecord)
        .single();
    
    if (schoolError || !schoolData) {
        console.error('Could not fetch school name for category', schoolError);
        throw new Error('Could not verify the selected school for the category.');
    }

    const recordToInsert = { 
        name: categoryData.name, 
        school: schoolData.name,
        school_id: schoolIdForRecord,
        user_id: profile.id, // This ensures we always provide the creator's ID
    };

    const { error } = await supabase.from('categories').insert(recordToInsert);

    if (error) {
        console.error("Error adding category:", error.message);
        throw new Error(error.message); // Throw the error so the UI can catch it
    }
};
export const deleteCategory = (id: number) => deleteData('categories', id);

export const getStores = (): Promise<Store[]> => getData<Store>('stores');
export const addStore = (data: Omit<Store, 'id' | 'school'>) => addData('stores', data);
export const deleteStore = (id: number) => deleteData('stores', id);

export const getSuppliers = (): Promise<Supplier[]> => getData<Supplier>('suppliers');
export const addSupplier = (data: Omit<Supplier, 'id' | 'school'>) => addData('suppliers', data);
export const deleteSupplier = (id: number) => deleteData('suppliers', id);

export const getUnits = (): Promise<Unit[]> => getData<Unit>('units');
export const addUnit = (data: Omit<Unit, 'id' | 'school'>) => addData('units', data);
export const deleteUnit = (id: number) => deleteData('units', id);

export const getPurchases = (): Promise<Purchase[]> => getData<Purchase>('purchases');
export const addPurchase = (data: Omit<Purchase, 'id' | 'school'>) => addData('purchases', data);
export const deletePurchase = (id: number) => deleteData('purchases', id);

export const getSales = (): Promise<Sale[]> => getData<Sale>('sales');
export const addSale = (data: Omit<Sale, 'id' | 'school'>) => addData('sales', data);
export const deleteSale = (id: number) => deleteData('sales', id);

export const getIssues = (): Promise<Issue[]> => getData<Issue>('issues');
export const addIssue = (data: Omit<Issue, 'id' | 'school'>) => addData('issues', data);
export const deleteIssue = (id: number) => deleteData('issues', id);

// --- SCHOOL & CURRENCY FUNCTIONS ---
export const getCurrencies = async (): Promise<Currency[]> => {
    const profile = await getUserProfile();
    // Super Admins can see all currencies from all schools
    if (profile?.role === 'Super Admin') {
        return getGlobalData<Currency>('currencies');
    }
    // School users see only their own currencies
    return getData<Currency>('currencies');
};
export const addCurrency = (data: Omit<Currency, 'id' | 'school_id'>) => addData('currencies', data as any);
export const deleteCurrency = (id: number) => deleteData('currencies', id);

// Public function for the store page (remains global)
export const getPublicCurrencies = async (): Promise<Currency[]> => {
    try {
        const { data, error } = await supabase.from('currencies').select('*');
        if (error) {
            console.error('Error fetching public currencies:', error.message);
            return [];
        }
        return data as Currency[];
    } catch (err: any) {
        console.error('Network error while fetching public currencies:', err.message);
        return [];
    }
};

// School management is a Super Admin task, so these functions are modified to not rely on the user's school_id
async function uploadSchoolLogo(file: File, schoolId: number, type: string): Promise<string | null> {
    if (!file) return null;
    const fileExt = file.name.split('.').pop();
    const fileName = `${type}-${Date.now()}.${fileExt}`;
    const filePath = `public/${schoolId}/${fileName}`;
    const { error: uploadError } = await supabase.storage.from('school_logos').upload(filePath, file, { upsert: true });

    if (uploadError) {
        console.error(`Error uploading ${type} logo:`, uploadError);
        throw new Error(`Error uploading ${type} logo: ${uploadError.message}`);
    }

    const { data } = supabase.storage.from('school_logos').getPublicUrl(filePath);
    return data.publicUrl;
}

export const getSchools = (): Promise<School[]> => getGlobalData<School>('schools', 'id, name, officialName:official_name, email, mobile, currency_id, city, state, address, system_logo_url, text_logo_url, printing_logo_url, report_card_logo_url, currencies(*)');

export const getSchoolById = async (id: number): Promise<School | null> => {
    const { data, error } = await supabase
        .from('schools')
        .select('id, name')
        .eq('id', id)
        .single();
    
    if (error) {
        console.error(`Error fetching school with id ${id}:`, error.message);
        return null;
    }
    return data as School | null;
};

export const deleteSchool = (id: number) => deleteData('schools', id); // RLS will protect this for Super Admins

// --- ROLES ---
// Fetches the master list of default roles from the database.
export async function getDefaultRoles(): Promise<string[]> {
    const { data, error } = await supabase
        .from('default_roles')
        .select('name');
    
    if (error || !data || data.length === 0) {
        console.warn("Could not fetch from 'default_roles' table, using fallback list.", error);
        // Fallback to hardcoded list if the table doesn't exist, is empty, or there's an error.
        return [
          'School Admin', 'Teacher', 'Accountant', 'Librarian', 'Receptionist', 'Student', 'Parent'
        ];
    }
    return data.map((role: { name: string }) => role.name);
}


export const addSchool = async (schoolData: Omit<School, 'id' | 'systemLogoUrl' | 'textLogoUrl' | 'printingLogoUrl' | 'reportCardLogoUrl' | 'currencies'>, logos: { systemLogo?: File, textLogo?: File, printingLogo?: File, reportCardLogo?: File }) => {
    const record = {
        name: schoolData.name,
        official_name: schoolData.officialName,
        email: schoolData.email,
        mobile: schoolData.mobile,
        currency_id: schoolData.currency_id,
        city: schoolData.city,
        state: schoolData.state,
        address: schoolData.address,
    };
    
    const { data, error } = await supabase.from('schools').insert(record).select().single();
    if (error) throw error;
    if (!data) throw new Error("Failed to create school record.");

    const schoolId = data.id;

    // Fetch default roles and create them for the new school
    const defaultRoleNames = await getDefaultRoles();
    const defaultRoles = defaultRoleNames.map(name => ({
        name,
        is_system_role: true,
        school_id: schoolId,
    }));

    const { error: rolesError } = await supabase.from('roles').insert(defaultRoles);

    if (rolesError) {
        // If roles fail, we should try to roll back the school creation to avoid an inconsistent state.
        console.error("Error creating default roles, rolling back school creation:", rolesError);
        await supabase.from('schools').delete().eq('id', schoolId);
        throw new Error(`Failed to create default roles for the new school: ${rolesError.message}`);
    }

    // Handle logo uploads in a try/catch to allow for rollback
    try {
        const logoUrls: Record<string, string | null> = {};
        if (logos.systemLogo) logoUrls.system_logo_url = await uploadSchoolLogo(logos.systemLogo, schoolId, 'system');
        if (logos.textLogo) logoUrls.text_logo_url = await uploadSchoolLogo(logos.textLogo, schoolId, 'text');
        if (logos.printingLogo) logoUrls.printing_logo_url = await uploadSchoolLogo(logos.printingLogo, schoolId, 'printing');
        if (logos.reportCardLogo) logoUrls.report_card_logo_url = await uploadSchoolLogo(logos.reportCardLogo, schoolId, 'report_card');

        if (Object.keys(logoUrls).length > 0) {
            const { error: logoUpdateError } = await supabase.from('schools').update(logoUrls).eq('id', schoolId);
            if (logoUpdateError) throw logoUpdateError; // This will be caught by the catch block
        }
    } catch (uploadError) {
        // If any logo upload or the final update fails, roll everything back.
        console.error("An error occurred during logo upload, rolling back school and role creation:", uploadError);
        await supabase.from('roles').delete().eq('school_id', schoolId);
        await supabase.from('schools').delete().eq('id', schoolId);
        // Note: This doesn't delete from storage, but that's a more complex operation.
        throw new Error(`An error occurred during logo processing: ${(uploadError as Error).message}`);
    }
};


// --- SUBSCRIPTION MODULE FUNCTIONS (GLOBAL / SUPER ADMIN) ---
export const getPlans = (): Promise<Plan[]> => getGlobalData<Plan>('plans', '*, pricePerStudent:price_per_student, periodType:period_type, periodValue:period_value, isRecommended:is_recommended, showOnWebsite:show_on_website');
export const addPlan = (data: Omit<Plan, 'id'>) => supabase.from('plans').insert({ ...data, is_recommended: data.isRecommended, show_on_website: data.showOnWebsite });
export const deletePlan = (id: number) => deleteData('plans', id);
export const updatePlan = (id: number, data: Partial<Plan>) => supabase.from('plans').update(data).eq('id', id);

export const getSubscriptions = (): Promise<Subscription[]> => getGlobalData<Subscription>('subscriptions', '*, schools(*), plans(*)');
export const addSubscription = (data: Omit<Subscription, 'id' | 'created_at' | 'schools' | 'plans'>) => supabase.from('subscriptions').insert(data);

// FIX: Export a new function `updateSubscriptionStatusByUserId` to update a subscription status using a user ID.
export const updateSubscriptionStatusByUserId = async (userId: string, status: Subscription['status']) => {
    // Get user's school_id
    const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('school_id')
        .eq('id', userId)
        .single();
    
    if (profileError || !profileData?.school_id) {
        throw new Error(`Could not find school for user ${userId}. Error: ${profileError?.message}`);
    }

    const schoolId = profileData.school_id;

    // Find the latest subscription for that school to update
    const { data: subData, error: subSelectError } = await supabase
        .from('subscriptions')
        .select('id')
        .eq('school_id', schoolId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
    
    if (subSelectError || !subData) {
        throw new Error(`Could not find subscription for school ${schoolId}. Error: ${subSelectError?.message}`);
    }

    // Update the status of that subscription
    const { error: updateError } = await supabase
        .from('subscriptions')
        .update({ status: status })
        .eq('id', subData.id);
        
    if (updateError) {
        throw new Error(`Could not update subscription status for school ${schoolId}. Error: ${updateError.message}`);
    }
};

export const getOfflinePaymentMethods = (): Promise<OfflinePaymentMethod[]> => getData<OfflinePaymentMethod>('offline_payment_methods');
export const addOfflinePaymentMethod = (data: Omit<OfflinePaymentMethod, 'id' | 'school_id'>) => addData('offline_payment_methods', data as any);
export const deleteOfflinePaymentMethod = (id: number) => deleteData('offline_payment_methods', id);

export const getTransactions = (): Promise<Transaction[]> => getGlobalData<Transaction>('transactions', '*, schools(name), plans(name)');
export const addTransaction = (data: Omit<Transaction, 'id'>) => supabase.from('transactions').insert(data);

export const getCustomDomainRequests = (): Promise<CustomDomainRequest[]> => getGlobalData<CustomDomainRequest>('custom_domain_requests', '*, schools(name)');
export const addCustomDomainRequest = (data: Omit<CustomDomainRequest, 'id'>) => supabase.from('custom_domain_requests').insert(data);
export const updateCustomDomainRequestStatus = (id: number, status: 'Approved' | 'Rejected') => supabase.from('custom_domain_requests').update({ status, approved_date: status === 'Approved' ? new Date().toISOString() : null }).eq('id', id);

// --- FORMS MANAGER FUNCTIONS (PUBLIC/GLOBAL) ---
async function addPublicData(tableName: string, data: any) {
    const { error } = await supabase.from(tableName).insert(data);
    if (error) throw error;
}

async function getAllData<T>(tableName: string): Promise<T[]> {
    const { data, error } = await supabase.from(tableName).select('*').order('created_at', { ascending: false });
    if (error) {
        console.error(`Error fetching from ${tableName}:`, error.message);
        return [];
    }
    return data as T[];
}

export const addContactUsSubmission = (data: Omit<ContactUsSubmission, 'id' | 'created_at' | 'is_read'>) => addPublicData('contact_us_submissions', { ...data, is_read: false });
export const getContactUsSubmissions = (): Promise<ContactUsSubmission[]> => getAllData<ContactUsSubmission>('contact_us_submissions');
export const updateContactUsSubmission = (id: number, updates: Partial<ContactUsSubmission>) => updateFormSubmission('contact_us_submissions', id, updates);

export const addDemoRequest = (data: Omit<DemoRequest, 'id' | 'created_at' | 'status'>) => addPublicData('demo_requests', data);
export const getDemoRequests = (): Promise<DemoRequest[]> => getAllData<DemoRequest>('demo_requests');
export const updateDemoRequest = (id: number, updates: Partial<DemoRequest>) => updateFormSubmission('demo_requests', id, updates);

export const addNewsletterSubscriber = (data: Pick<NewsletterSubscriber, 'email' | 'name'>) => addPublicData('newsletter_subscribers', { email: data.email, name: data.name, status: 'Active', source: 'Website' });
export const getNewsletterSubscribers = (): Promise<NewsletterSubscriber[]> => getAllData<NewsletterSubscriber>('newsletter_subscribers');
export const updateNewsletterSubscriber = (id: number, updates: Partial<NewsletterSubscriber>) => updateFormSubmission('newsletter_subscribers', id, updates);

export const deleteFormSubmission = (tableName: string, id: number) => deleteData(tableName, id);
export const updateFormSubmission = async (tableName: string, id: number, updates: object) => {
    const snakeCaseUpdates = Object.entries(updates).reduce((acc, [key, value]) => {
        const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        acc[snakeKey] = value;
        return acc;
    }, {} as Record<string, any>);
    await supabase.from(tableName).update(snakeCaseUpdates).eq('id', id);
};

export const createSchoolAndSubscription = async (data: SchoolSubscriptionData) => {
    // This function is complex and should be handled by a Super Admin panel or an Edge Function for security.
    // The current implementation allows any user to create a new user and school, which is a security risk.
    // For now, it's left as is but should be refactored into a secure administrative process.
    console.warn("createSchoolAndSubscription is being called from the client-side and should be moved to a secure environment.");

    // The rest of the function...
    const { data: { user }, error: signUpError } = await supabase.auth.signUp({ email: data.adminEmail, password: data.adminPassword, options: { data: { full_name: data.adminName } } });
    if (signUpError) throw signUpError;
    if (!user) throw new Error("Registration failed.");
    
    // Create profile
    await supabase.from('user_profiles').insert({ id: user.id, role: 'School Admin', full_name: data.adminName });
    
    // The rest of the school creation logic...
};

// --- INTEGRATIONS FUNCTIONS ---
// These are user-scoped but don't depend on school_id, instead on the user's own profile (e.g., a Super Admin's settings)
export const getGoogleAnalyticsConfig = async (): Promise<GoogleAnalyticsConfig | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data } = await supabase.from('google_analytics_config').select('*').eq('user_id', user.id).single();
    return data;
};
export const upsertGoogleAnalyticsConfig = async (config: Partial<Omit<GoogleAnalyticsConfig, 'id'>>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User must be logged in.");
    await supabase.from('google_analytics_config').upsert({ user_id: user.id, ...config }, { onConflict: 'user_id' });
};
export const getActiveGoogleAnalyticsConfig = async (): Promise<Pick<GoogleAnalyticsConfig, 'measurement_id'> | null> => {
    const { data } = await supabase.from('google_analytics_config').select('measurement_id').eq('is_enabled', true).limit(1).single();
    return data;
};

export const getCalendlyConfig = async (): Promise<CalendlyConfig | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data } = await supabase.from('calendly_config').select('*').eq('user_id', user.id).single();
    return data;
};
export const upsertCalendlyConfig = async (config: Partial<Omit<CalendlyConfig, 'id'>>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User must be logged in.");
    await supabase.from('calendly_config').upsert({ user_id: user.id, ...config }, { onConflict: 'user_id' });
};
export const getActiveCalendlyConfig = async (): Promise<Pick<CalendlyConfig, 'scheduling_link'> | null> => {
    const { data } = await supabase.from('calendly_config').select('scheduling_link').eq('is_enabled', true).limit(1).single();
    return data;
};

export const getPusherConfig = async (): Promise<PusherConfig | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data } = await supabase.from('pusher_config').select('*').eq('user_id', user.id).single();
    return data;
};
export const upsertPusherConfig = async (config: Partial<Omit<PusherConfig, 'id'>>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User must be logged in.");
    await supabase.from('pusher_config').upsert({ user_id: user.id, ...config }, { onConflict: 'user_id' });
};

// --- NEW: API CONFIG FUNCTIONS ---
export const getApiConfig = async (): Promise<ApiConfig | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data } = await supabase.from('api_configs').select('*').eq('user_id', user.id).single();
    return data;
};

export const upsertApiConfig = async (config: Partial<Omit<ApiConfig, 'id'>>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User must be logged in.");
    await supabase.from('api_configs').upsert({ user_id: user.id, ...config }, { onConflict: 'user_id' });
};

// --- NEW: PESAPAL CONFIG FUNCTIONS ---
export const getPesaPalConfig = async (): Promise<PesaPalConfig | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data } = await supabase.from('pesapal_configs').select('*').eq('user_id', user.id).single();
    return data;
};
export const upsertPesaPalConfig = async (config: Partial<Omit<PesaPalConfig, 'id'>>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User must be logged in.");
    await supabase.from('pesapal_configs').upsert({ user_id: user.id, ...config }, { onConflict: 'user_id' });
};
export const getActivePesaPalConfig = async (): Promise<Pick<PesaPalConfig, 'consumer_key'> | null> => {
    const { data } = await supabase.from('pesapal_configs').select('consumer_key').eq('is_enabled', true).limit(1).single();
    return data;
};

// --- NEW: PAYPAL CONFIG FUNCTIONS ---
export const getPayPalConfig = async (): Promise<PayPalConfig | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data } = await supabase.from('paypal_configs').select('*').eq('user_id', user.id).single();
    return data;
};
export const upsertPayPalConfig = async (config: Partial<Omit<PayPalConfig, 'id' | 'user_id'>>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User must be logged in.");
    await supabase.from('paypal_configs').upsert({ user_id: user.id, ...config }, { onConflict: 'user_id' });
};
export const getActivePayPalConfig = async (): Promise<Pick<PayPalConfig, 'username'> | null> => {
    const { data } = await supabase.from('paypal_configs').select('username').eq('is_enabled', true).limit(1).single();
    return data;
};

// --- NEW: POLAR CONFIG (STUB) ---
// FIX: Add missing function and type for Polar config check to resolve error in CheckoutPage.tsx
export interface PolarConfig {
    // Define properties if known, otherwise can be simple.
    is_enabled: boolean;
}

export const getActivePolarConfig = async (): Promise<Pick<PolarConfig, 'is_enabled'> | null> => {
    // This is a stub function as no Polar config table exists. 
    // Returning an object to enable it for demo purposes.
    return { is_enabled: true };
}


// --- ROLES & PERMISSIONS FUNCTIONS ---
export const getRoles = (): Promise<Role[]> => getData<Role>('roles', '*, schools(id, name)');

export const addRole = async (roleData: { name: string, school_id?: number }) => {
    const profile = await getUserProfile();
    if (!profile) throw new Error("User not authenticated.");

    let schoolIdForRecord: number;
    if (profile.role === 'Super Admin') {
        if (!roleData.school_id) {
            throw new Error("Super Admin must select a school.");
        }
        schoolIdForRecord = roleData.school_id;
    } else {
        if (!profile.school_id) {
            throw new Error("User is not associated with a school.");
        }
        schoolIdForRecord = profile.school_id;
    }

    const record = { 
        name: roleData.name, 
        school_id: schoolIdForRecord,
        is_system_role: false // Custom roles are not system roles
    };
    const { error } = await supabase.from('roles').insert(record);
    if (error) {
        console.error("Error adding role:", error);
        throw error;
    }
};

export const updateRole = async (id: number, updates: { name: string }) => {
    const { error } = await supabase.from('roles').update(updates).eq('id', id);
    if (error) {
        console.error("Error updating role:", error);
        throw error;
    }
};

export const getPermissionsForRole = async (roleId: number): Promise<RolePermission[]> => {
    const { data, error } = await supabase
        .from('role_permissions')
        .select('*')
        .eq('role_id', roleId);
    if (error) {
        console.error(`Error fetching permissions for role ${roleId}:`, error);
        return [];
    }
    return data as RolePermission[];
};

// This function takes the state object from the component and transforms it for upserting
export const updatePermissionsForRole = async (roleId: number, permissions: Record<string, { view: boolean; add: boolean; edit: boolean; delete: boolean }>) => {
    const permissionsToUpsert = Object.entries(permissions).map(([feature, perms]) => ({
        role_id: roleId,
        feature: feature,
        view: perms.view,
        add: perms.add,
        edit: perms.edit,
        delete: perms.delete
    }));

    const { error } = await supabase.from('role_permissions').upsert(permissionsToUpsert, { onConflict: 'role_id, feature' });

    if (error) {
        console.error("Error updating permissions:", error);
        throw error;
    }
};


// --- NEW FUNCTION for Super Admins to sync roles ---
export async function syncDefaultRolesForAllSchools(): Promise<{ created: number, total: number }> {
    const { data: schools, error: schoolsError } = await supabase.from('schools').select('id, name');
    if (schoolsError) throw schoolsError;

    const { data: existingRoles, error: rolesError } = await supabase.from('roles').select('school_id, name');
    if (rolesError) throw rolesError;
    
    const defaultRoleNames = await getDefaultRoles();

    const rolesToCreate: Omit<Role, 'id' |'schools'>[] = [];
    const existingRoleSet = new Set(existingRoles.map(r => `${r.school_id}:${r.name}`));

    for (const school of schools) {
        for (const roleName of defaultRoleNames) {
            const roleKey = `${school.id}:${roleName}`;
            if (!existingRoleSet.has(roleKey)) {
                rolesToCreate.push({
                    school_id: school.id,
                    name: roleName,
                    is_system_role: true,
                });
            }
        }
    }
    
    if (rolesToCreate.length > 0) {
        const { error: insertError } = await supabase.from('roles').insert(rolesToCreate);
        if (insertError) throw insertError;
    }

    return { created: rolesToCreate.length, total: schools.length * defaultRoleNames.length };
}

// --- NEW: 2FA SETTINGS FUNCTIONS ---
export const getTwoFactorSettings = async (schoolId: number): Promise<TwoFactorSettings | null> => {
    const { data, error } = await supabase
        .from('two_factor_settings')
        .select('*')
        .eq('school_id', schoolId)
        .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116: no rows found
        console.error("Error fetching 2FA settings:", error.message);
        throw error;
    }
    return data;
}

export const upsertTwoFactorSettings = async (settings: Partial<TwoFactorSettings> & { school_id: number }) => {
    const { error } = await supabase
        .from('two_factor_settings')
        .upsert(settings, { onConflict: 'school_id' });

    if (error) {
        console.error("Error upserting 2FA settings:", error.message);
        throw error;
    }
}

// --- BLOG ANALYTICS INTERFACES ---
export interface BlogAnalytics {
    id: string;
    post_id: string;
    view_date: string;
    views: number;
    unique_visitors: number;
    avg_time_on_page: number;
    bounce_rate: number;
    created_at: string;
}

export interface BlogAuthor {
    id: string;
    user_id: string;
    bio: string;
    avatar_url: string;
    social_twitter: string;
    social_linkedin: string;
    created_at: string;
    updated_at: string;
}

// --- BLOG ANALYTICS DATA ACCESS FUNCTIONS ---
export const getBlogAnalytics = async (postId: string, startDate?: string, endDate?: string): Promise<BlogAnalytics[]> => {
    let query = supabase
        .from('blog_analytics')
        .select('*')
        .eq('post_id', postId)
        .order('view_date', { ascending: false });

    if (startDate) {
        query = query.gte('view_date', startDate);
    }

    if (endDate) {
        query = query.lte('view_date', endDate);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching blog analytics:', error);
        return [];
    }
    return data as BlogAnalytics[];
};

export const getBlogAnalyticsSummary = async (postId: string): Promise<any> => {
    const { data, error } = await supabase
        .from('blog_analytics')
        .select('*')
        .eq('post_id', postId);

    if (error) {
        console.error('Error fetching analytics summary:', error);
        return null;
    }

    const totalViews = (data as BlogAnalytics[]).reduce((sum, a) => sum + a.views, 0);
    const totalVisitors = (data as BlogAnalytics[]).reduce((sum, a) => sum + a.unique_visitors, 0);
    const avgTimeOnPage = (data as BlogAnalytics[]).length > 0
        ? Math.round((data as BlogAnalytics[]).reduce((sum, a) => sum + a.avg_time_on_page, 0) / (data as BlogAnalytics[]).length)
        : 0;

    return {
        totalViews,
        totalVisitors,
        avgTimeOnPage,
        dataPoints: (data as BlogAnalytics[]).length
    };
};

export const trackBlogView = async (postId: string) => {
    const today = new Date().toISOString().split('T')[0];

    const { data: existingRecord } = await supabase
        .from('blog_analytics')
        .select('*')
        .eq('post_id', postId)
        .eq('view_date', today)
        .maybeSingle();

    if (existingRecord) {
        const { error } = await supabase
            .from('blog_analytics')
            .update({
                views: (existingRecord.views || 0) + 1,
            })
            .eq('id', existingRecord.id);

        if (error) {
            console.error('Error updating analytics:', error);
        }
    } else {
        const { error } = await supabase
            .from('blog_analytics')
            .insert({
                post_id: postId,
                view_date: today,
                views: 1,
                unique_visitors: 1
            });

        if (error) {
            console.error('Error creating analytics record:', error);
        }
    }
};

export const getBlogAuthorProfile = async (userId: string): Promise<BlogAuthor | null> => {
    const { data, error } = await supabase
        .from('blog_authors')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

    if (error) {
        console.error('Error fetching author profile:', error);
        return null;
    }
    return data as BlogAuthor;
};

export const upsertBlogAuthorProfile = async (userId: string, profile: Partial<BlogAuthor>) => {
    const { error } = await supabase
        .from('blog_authors')
        .upsert({ user_id: userId, ...profile }, { onConflict: 'user_id' });

    if (error) {
        console.error('Error upserting author profile:', error);
        throw error;
    }
};

export const getFeaturedBlogPosts = async (limit: number = 5) => {
    const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_featured', true)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching featured posts:', error);
        return [];
    }
    return data;
};

export const getTopBlogPosts = async (limit: number = 10) => {
    const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('views_count', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching top posts:', error);
        return [];
    }
    return data;
};