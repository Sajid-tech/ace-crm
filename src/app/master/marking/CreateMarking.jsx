import React from "react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import BASE_URL from "@/config/BaseUrl";
import { Loader2, SquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLocation } from "react-router-dom";
import { ButtonConfig } from "@/config/ButtonConfig";
import { MarkingCreate } from "@/components/buttonIndex/ButtonComponents";
const CreateMarking = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    marking: "",
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { pathname } = useLocation();
  const handleSubmit = async () => {
    if (!formData.marking.trim()) {
      toast({
        title: "Error",
        description: "marking are required",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${BASE_URL}/api/panel-create-marking`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response?.data.code == 200) {
    
        toast({
          title: "Success",
          description: response.data.msg
        });
  
        setFormData({
          marking: "",
        });
        await queryClient.invalidateQueries(["markings"]);
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
        description:
          error.response?.data?.message || "Failed to create marking",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {pathname === "/master/marking" ? (
          // <Button
          //   variant="default"
          //   className={`ml-2 ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
          // >
          //   <SquarePlus className="h-4 w-4 " /> Marking
          // </Button>
          <div>
            <MarkingCreate
              className={`ml-2 ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
            ></MarkingCreate>
          </div>
        ) : pathname === "/create-contract"  || pathname === "/create-invoice" ? (
          <p className="text-sm text-blue-600  hover:text-red-800 cursor-pointer">
            Create Marking
          </p>
        ) : null}
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Create New Marking</h4>
            <p className="text-sm text-muted-foreground">
              Enter the details for the new marking
            </p>
          </div>
          <div className="grid gap-2">
            <Input
              id="marking"
              placeholder="Enter marking... "
              value={formData.marking}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  marking: e.target.value,
                }))
              }
            />

            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`mt-2 ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create marking"
              )}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CreateMarking;
