import Login from "./app/auth/Login";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "./app/home/Home";

import ContractList from "./app/contract/ContractList";
import ContractAdd from "./app/contract/ContractAdd";
import InvoiceList from "./app/invoice/InvoiceList";
import InvoiceAdd from "./app/invoice/InvoiceAdd";
import BranchList from "./app/master/branch/BranchList";
import CreateBranch from "./app/master/branch/CreateBranch";
import EditBranch from "./app/master/branch/EditBranch";
import StateList from "./app/master/state/StateList";
import BankList from "./app/master/bank/BankList";
import SchemeList from "./app/master/scheme/SchemeList";
import CountryList from "./app/master/country/CountryList";
import ContainerSizeList from "./app/master/ContainerSize/ContainerSizeList";
import PaymentTermCList from "./app/master/paymentTermC/PaymentTermCList";
import ItemList from "./app/master/item/ItemList";
import MarkingList from "./app/master/marking/MarkingList";
import DescriptionGoodsList from "./app/master/descriptionGoods/DescriptionGoodsList";
import CustomDescription from "./app/master/customDescription/CustomDescription";
import BagTypeList from "./app/master/bagType/BagTypeList";
import TypeList from "./app/master/type/TypeList";
import QualityList from "./app/master/quality/QualityList";
import ViewContract from "./app/contract/ViewContract";
import EditContract from "./app/contract/EditContract";
import Buyer from "./app/reports/buyer/Buyer";
import ContractForm from "./app/reports/contract/ContractForm";
import ContractReport from "./app/reports/contract/ContractReport";
import PreshipmentDetails from "./app/invoice/PreshipmentDetails";
import InvoiceView from "./app/invoice/InvoiceView";
import InvoiceEdit from "./app/invoice/InvoiceEdit";
import InvoiceTabs from "./app/invoice/InvoiceTabs";
import PortOfLoadingList from "./app/master/portofLoading/PortofLoadingList";
import GrCodeList from "./app/master/grcode/GrCodeList";
import ProductList from "./app/master/product/ProductList";
import ProductionDescriptionList from "./app/master/productDescription/ProductionDescriptionList";
import ShipperList from "./app/master/shipper/ShipperList";
import VesselList from "./app/master/vessel/VesselList";
import PreReceiptList from "./app/master/preReceipt/PreReceiptList";
import TestViewPrint from "./app/contract/TestViewPrint";
import InvoiceDocumentEdit from "./app/invoice/InvoiceDocumentEdit";
import UserPage from "./app/userManagement/UserPage";
import ManagementDashboard from "./app/userManagement/ManagementDashboard";
import CreatePage from "./app/userManagement/CreatePage";
import CreateButton from "./app/userManagement/CreateButton";
import UserTypeList from "./app/UserType/UserTypeList";
import EditUserType from "./app/UserType/EditUserType";

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <Routes>
          {/* Login Page        */}
          <Route path="/" element={<Login />} />
          {/* Dashboard  */}
          <Route path="/home" element={<Home />} />
          {/* Contract  */}
          <Route path="/contract" element={<ContractList />} />
          <Route path="/create-contract" element={<ContractAdd />} />
          <Route path="/view-contract/:id" element={<ViewContract />} />
          <Route path="/tesview-contract/:id" element={<TestViewPrint />} />
          <Route path="/edit-contract/:id" element={<EditContract />} />
          {/* Invoice  */}
          <Route path="/invoice" element={<InvoiceList />} />
          <Route path="/create-invoice" element={<InvoiceAdd />} />
          <Route path="/edit-invoice/:id" element={<InvoiceEdit />} />
          <Route
            path="/document-edit-invoice/:id"
            element={<InvoiceDocumentEdit />}
          />
          <Route path="/view-invoice/:id" element={<InvoiceTabs />} />

          {/* Master - Branch  */}

          <Route path="/master/branch" element={<BranchList />} />
          <Route path="/create-branch" element={<CreateBranch />} />
          <Route path="/edit-branch/:id" element={<EditBranch />} />

          {/* Master -State  */}
          <Route path="/master/state" element={<StateList />} />
          {/* Master -  Bank */}
          <Route path="/master/bank" element={<BankList />} />
          {/* Master Scheme  */}
          <Route path="/master/scheme" element={<SchemeList />} />

          {/* Master -Country */}
          <Route path="/master/country" element={<CountryList />} />
          {/* Master -ContainerSize */}
          <Route path="/master/containersize" element={<ContainerSizeList />} />
          {/* Master -Payment Term C */}
          <Route path="/master/paymentTermC" element={<PaymentTermCList />} />
          {/* Master -Description of Goods */}
          <Route
            path="/master/descriptionGoods"
            element={<DescriptionGoodsList />}
          />
          {/* Master -Bag List */}
          <Route path="/master/bagType" element={<BagTypeList />} />
          {/* Master -customdescription */}
          <Route
            path="/master/customdescription"
            element={<CustomDescription />}
          />
          {/* Master -items */}
          <Route path="/master/item" element={<ItemList />} />
          {/* Master -marking */}
          <Route path="/master/marking" element={<MarkingList />} />
          {/* Master -typelist */}
          <Route path="/master/type" element={<TypeList />} />
          {/* Master -Quality  */}
          <Route path="/master/quality" element={<QualityList />} />
          {/* Master -port of  loading   */}
          <Route path="/master/portofloading" element={<PortOfLoadingList />} />
          {/* Master -gr code */}
          <Route path="/master/grcode" element={<GrCodeList />} />
          {/* Master - Product */}
          <Route path="/master/product" element={<ProductList />} />
          {/* Master - productdescription */}
          <Route
            path="/master/productdescription"
            element={<ProductionDescriptionList />}
          />
          {/* Master - shipper */}
          <Route path="/master/shipper" element={<ShipperList />} />
          {/* Master - vessel */}
          <Route path="/master/vessel" element={<VesselList />} />
          {/* Master - prerecepits*/}
          <Route path="/master/prerecepits" element={<PreReceiptList />} />

          {/* //Reports */}
          {/* Reports -Buyer  */}
          <Route path="/report/buyer-report" element={<Buyer />} />
          <Route path="/report/contract-form" element={<ContractForm />} />
          <Route path="/report/contract-report" element={<ContractReport />} />

          {/* //management */}
          <Route path="/userManagement" element={<UserPage />} />
          <Route
            path="/management-dashboard/:id"
            element={<ManagementDashboard />}
          />
          <Route path="/page-management" element={<CreatePage />} />
          <Route path="/button-management" element={<CreateButton />} />
          {/* //usertype */}
          <Route path="/user-type" element={<UserTypeList />} />
          <Route path="/edit-user-type/:id" element={<EditUserType />} />
        </Routes>
      </QueryClientProvider>
    </>
  );
}

export default App;
