import React, { useMemo } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';

import { CalendarCheck, Landmark, Phone } from "lucide-react";
import type { ICollection, ISelectList } from "../../BranchManager/TodayCollection";
import { formatDate } from "../../../Constant";
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store';

interface Props {
  data: ICollection;
  isMatched: boolean;
  onPaidClick: (paymentId: string, loanId: string, status: string) => void;
  onAdvanceClick: (paymentId: string, loanId: string, status: string) => void;
  handleSelectedList: (isSelected: boolean, payload: ISelectList) => void;
  selectedList: ISelectList[];
  isChecked?: boolean;
  selectedCollector?: string;
}

const CollectionCard: React.FC<Props> = ({
  data,
  isMatched = true,
  onPaidClick,
  onAdvanceClick,
  selectedCollector, handleSelectedList, isChecked, selectedList
}) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { loan, collectionDate, status, emiCount } = data;
  const customer = typeof loan?.customer === 'object' ? loan.customer : null;

  const isBranchManager = user?.role === "branchManager";
  const disableActions = isBranchManager && selectedCollector !== user._id;

  const displayStatus = useMemo(() => {
    if (status.toLowerCase() === "paid" && emiCount > 1) return "Advance";
    return status;
  }, [status, emiCount]);

  const disablePaidBtn = useMemo(() => {
    return displayStatus === "Advance" || data.isBlockUnpaid || status.toLowerCase() === "paid";
  }, [displayStatus, data.isBlockUnpaid, status]);

  const statusColor = useMemo(() => {
    switch (displayStatus) {
      case "Paid":
        return "bg-green-500";
      case "UnPaid":
        return "bg-red-500";
      case "Advance":
        return "bg-yellow-500";
      default:
        return "bg-gray-400";
    }
  }, [displayStatus]);

  const isSelected = () => {
    const isInList = selectedList.some((ele) => ele.paymentId === data._id);
    if (displayStatus.toLowerCase() === 'advance' || displayStatus.toLowerCase()==='paid') {
      return false;
    }
    if (!isInList && isChecked) {
      return true;
    }
    return false;
  }

  const handleClick = () => {
    const isChecked = isSelected();

    const payload = { paymentId: data._id, loanId: data.loan._id }
    handleSelectedList(!isChecked, payload)

  }

  return (
    <div className={`transition duration-300 ${!isMatched ? "opacity-50" : ""} cursor-pointer`}>
      <Card
        onClick={handleClick}
        sx={{
          backgroundColor: isSelected() ? '#bfdbfe' : '#ffffff',
          transition: 'background-color 0.3s ease',
        }}
        className={`w-full max-w-7xl mx-auto my-4 shadow-lg rounded-2xl border border-gray-200`}>
        <CardHeader
          title={`Collection for ${customer?.name || 'N/A'}`}
          subheader={`Customer ID: ${customer?.customerId || 'N/A'}`}

          sx={{
            backgroundColor: isSelected() ? '#bfdbfe' : '#f3f4f6',
            transition: 'background-color 0.3s ease',
          }}
          className="rounded-t-2xl"
        />
        <CardContent className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:justify-between text-sm text-gray-700">

            <div>
              <Phone className="inline mr-2" size={16} />
              <strong>Phone:</strong> {customer?.phone}
            </div>
          </div>

          <div className="text-sm text-gray-700">
            <Landmark className="inline mr-2" size={16} />
            <strong>Address:</strong> {customer?.address}
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between text-sm text-gray-700">
            <div>
              <strong>EMI Per Day:</strong> ₹{loan?.emiPerDay}
            </div>
            <div>
              <strong>Paid EMIs:</strong> {loan?.paidEmi}/{loan?.tenure}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between text-sm text-gray-700">
            <div>
              <CalendarCheck className="inline mr-2" size={16} />
              <strong>Collection Date:</strong> {formatDate(collectionDate)}
            </div>
            <div>
              <strong>Status:</strong>{' '}
              <span className={`px-2 py-1 rounded-full text-white text-xs ${statusColor}`}>
                {displayStatus === 'Advance' ? `${data.emiCount - 1} Days Advance` : displayStatus}
              </span>
            </div>
          </div>

          {!disableActions && (
            <div className="flex justify-end gap-4 pt-2">
              {!disablePaidBtn && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => onPaidClick(data._id, loan._id, data.status)}
                >
                  Mark Paid
                </Button>
              )}

              <Button
                variant="contained"
                color="primary"
                onClick={() => onAdvanceClick(data._id, loan._id, data.status)}
              >
                Advance
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CollectionCard;
