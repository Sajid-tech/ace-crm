import { useToast } from "@/hooks/use-toast";
import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import axios from "axios";
import BASE_URL from "@/config/BaseUrl";
import { Edit, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { ButtonConfig } from "@/config/ButtonConfig";
import { BankEdit } from "@/components/buttonIndex/ButtonComponents";

const EditBank = ({ bankId }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    bank_name: "",
    bank_details: "",
    bank_acc_no: "",
    bank_branch: "",
    bank_ifsc_code: "",
    bank_status: "Active",
  });

  const fetchCustomerData = async () => {
    setIsFetching(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-bank-by-id/${bankId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const bankData = response.data.bank;
      setFormData({
        bank_name: bankData.bank_name,
        bank_details: bankData.bank_details,
        bank_acc_no: bankData.bank_acc_no,
        bank_branch: bankData.bank_branch,
        bank_ifsc_code: bankData.bank_ifsc_code,
        bank_status: bankData.bank_status,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch bank data",
        variant: "destructive",
      });
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchCustomerData();
    }
  }, [open]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStatusChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      bank_status: value,
    }));
  };

  const handleSubmit = async () => {
    if (
      !formData.bank_name ||
      !formData.bank_acc_no ||
      !formData.bank_branch ||
      !formData.bank_ifsc_code ||
      !formData.bank_status
    ) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${BASE_URL}/api/panel-update-bank/${bankId}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response?.data.code == 200) {
        toast({
          title: "Success",
          description: response.data.msg,
        });

        await queryClient.invalidateQueries(["banks"]);
        setOpen(false);
      } else {
        toast({
          title: "Error",
          description: response.data.msg,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update Bank",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* <DialogTrigger asChild>
           <Button variant="ghost" size="icon">
             <Edit className="h-4 w-4" />
           </Button>
         </DialogTrigger> */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              {/* <Button
                variant="ghost"
                size="icon"
                className={`transition-all duration-200 ${
                  isHovered ? "bg-blue-50" : ""
                }`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <Edit
                  className={`h-4 w-4 transition-all duration-200 ${
                    isHovered ? "text-blue-500" : ""
                  }`}
                />
              </Button> */}
              <BankEdit
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              ></BankEdit>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Edit Bank</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Bank</DialogTitle>
        </DialogHeader>

        {isFetching ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="bank_name">Bank Name</Label>
              <Input
                id="bank_name"
                name="bank_name"
                value={formData.bank_name}
                onChange={handleInputChange}
                placeholder="Enter Bank name"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bank_acc_no">Account No</Label>
              <Input
                id="bank_acc_no"
                name="bank_acc_no"
                value={formData.bank_acc_no}
                onChange={handleInputChange}
                placeholder="Enter Account No"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bank_ifsc_code">Shift Code</Label>
              <Input
                id="bank_ifsc_code"
                name="bank_ifsc_code"
                value={formData.bank_ifsc_code}
                onChange={handleInputChange}
                placeholder="Enter Shift Code"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bank_branch">Branch Name</Label>
              <Input
                id="bank_branch"
                name="bank_branch"
                value={formData.bank_branch}
                onChange={handleInputChange}
                placeholder="Enter Branch Name "
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bank_details">Bank Details</Label>
              <Input
                id="bank_details"
                name="bank_details"
                value={formData.bank_details}
                onChange={handleInputChange}
                placeholder="Enter Bank Details "
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bank_status">Status</Label>
              <Select
                value={formData.bank_status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || isFetching}
            className={`${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Bank"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditBank;
