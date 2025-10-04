import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Leader, Member } from "@/types/booking";
import { Trash2, Plus, User, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface MemberFormProps {
  groupSize: number;
  leader: Leader;
  members: Member[];
  onLeaderChange: (leader: Leader) => void;
  onMembersChange: (members: Member[]) => void;
  errors?: {
    leader?: { [key: string]: string };
    members?: { [key: number]: { [key: string]: string } };
  };
}

export const MemberForm = ({
  groupSize,
  leader,
  members,
  onLeaderChange,
  onMembersChange,
  errors,
}: MemberFormProps) => {
  const handleAddMember = () => {
    if (members.length >= 6) {
      toast.error("สามารถเพิ่มสมาชิกได้สูงสุด 7 คน (รวมหัวหน้า)");
      return;
    }
    const newMember: Member = {
      id: Date.now(),
      name: "",
      age: 0,
      emergencyContact: "",
    };
    onMembersChange([...members, newMember]);
  };

  const handleRemoveMember = (id: number) => {
    if (members.length <= 4) {
      toast.error("ต้องมีสมาชิกอย่างน้อย 5 คน (รวมหัวหน้า)");
      return;
    }
    onMembersChange(members.filter((m) => m.id !== id));
  };

  const handleMemberChange = (
    id: number,
    field: keyof Member,
    value: string | number
  ) => {
    onMembersChange(
      members.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <User className="w-8 h-8 text-primary" />
        <h2 className="text-3xl font-spooky text-primary">ข้อมูลสมาชิก</h2>
      </div>

      {/* Leader Section */}
      <div className="bg-card rounded-xl p-6 border-2 border-primary glow-orange">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span>👤</span> หัวหน้ากลุ่ม (Leader)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="leader-name">
              ชื่อ-นามสกุล <span className="text-destructive">*</span>
            </Label>
            <Input
              id="leader-name"
              value={leader.name}
              onChange={(e) => onLeaderChange({ ...leader, name: e.target.value })}
              placeholder="กรอกชื่อ-นามสกุล"
              className={`mt-2 border-2 focus:border-primary min-h-[48px] ${
                errors?.leader?.name ? "border-destructive" : "border-input"
              }`}
              required
            />
            {errors?.leader?.name && (
              <div className="flex items-center gap-1 mt-1 text-sm text-destructive">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.leader.name}</span>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="leader-email">
              อีเมล <span className="text-destructive">*</span>
            </Label>
            <Input
              id="leader-email"
              type="email"
              value={leader.email}
              onChange={(e) => onLeaderChange({ ...leader, email: e.target.value })}
              placeholder="example@email.com"
              className={`mt-2 border-2 focus:border-primary min-h-[48px] ${
                errors?.leader?.email ? "border-destructive" : "border-input"
              }`}
              required
            />
            {errors?.leader?.email && (
              <div className="flex items-center gap-1 mt-1 text-sm text-destructive">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.leader.email}</span>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="leader-phone">
              เบอร์โทรศัพท์ <span className="text-destructive">*</span>
            </Label>
            <Input
              id="leader-phone"
              type="tel"
              value={leader.phone}
              onChange={(e) => onLeaderChange({ ...leader, phone: e.target.value })}
              placeholder="0XX-XXX-XXXX"
              className={`mt-2 border-2 focus:border-primary min-h-[48px] ${
                errors?.leader?.phone ? "border-destructive" : "border-input"
              }`}
              required
            />
            {errors?.leader?.phone && (
              <div className="flex items-center gap-1 mt-1 text-sm text-destructive">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.leader.phone}</span>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="leader-age">
              อายุ <span className="text-destructive">*</span>
            </Label>
            <Input
              id="leader-age"
              type="number"
              value={leader.age || ""}
              onChange={(e) =>
                onLeaderChange({ ...leader, age: parseInt(e.target.value) || 0 })
              }
              placeholder="25"
              className={`mt-2 border-2 focus:border-primary min-h-[48px] ${
                errors?.leader?.age ? "border-destructive" : "border-input"
              }`}
              min="5"
              max="100"
              required
            />
            {errors?.leader?.age && (
              <div className="flex items-center gap-1 mt-1 text-sm text-destructive">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.leader.age}</span>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="leader-line">Line ID (ถ้ามี)</Label>
            <Input
              id="leader-line"
              value={leader.lineId || ""}
              onChange={(e) => onLeaderChange({ ...leader, lineId: e.target.value })}
              placeholder="line.id"
              className="mt-2 border-2 border-input focus:border-primary min-h-[48px]"
            />
          </div>
        </div>
      </div>

      {/* Members Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <span>👥</span> สมาชิกในกลุ่ม (Members)
          </h3>
          <div className="text-sm text-muted-foreground">
            กำลังกรอกข้อมูล: {members.length + 1}/{groupSize} คน
          </div>
        </div>

        <div className="space-y-4">
          {members.map((member, index) => (
            <div
              key={member.id}
              className="bg-card rounded-xl p-6 border-2 border-border hover:border-secondary transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold">
                    {index + 2}
                  </div>
                  <span className="font-semibold">สมาชิกคนที่ {index + 2}</span>
                </div>
                {members.length > 4 && (
                  <Button
                    onClick={() => handleRemoveMember(member.id)}
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 min-h-[40px]"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor={`member-${member.id}-name`}>
                    ชื่อ-นามสกุล <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`member-${member.id}-name`}
                    value={member.name}
                    onChange={(e) =>
                      handleMemberChange(member.id, "name", e.target.value)
                    }
                    placeholder="กรอกชื่อ-นามสกุล"
                    className={`mt-2 border-2 focus:border-secondary min-h-[48px] ${
                      errors?.members?.[index]?.name
                        ? "border-destructive"
                        : "border-input"
                    }`}
                    required
                  />
                  {errors?.members?.[index]?.name && (
                    <div className="flex items-center gap-1 mt-1 text-sm text-destructive">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.members[index].name}</span>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor={`member-${member.id}-age`}>
                    อายุ <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`member-${member.id}-age`}
                    type="number"
                    value={member.age || ""}
                    onChange={(e) =>
                      handleMemberChange(
                        member.id,
                        "age",
                        parseInt(e.target.value) || 0
                      )
                    }
                    placeholder="25"
                    className={`mt-2 border-2 focus:border-secondary min-h-[48px] ${
                      errors?.members?.[index]?.age
                        ? "border-destructive"
                        : "border-input"
                    }`}
                    min="5"
                    max="100"
                    required
                  />
                  {errors?.members?.[index]?.age && (
                    <div className="flex items-center gap-1 mt-1 text-sm text-destructive">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.members[index].age}</span>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor={`member-${member.id}-emergency`}>
                    เบอร์ฉุกเฉิน (ถ้ามี)
                  </Label>
                  <Input
                    id={`member-${member.id}-emergency`}
                    type="tel"
                    value={member.emergencyContact || ""}
                    onChange={(e) =>
                      handleMemberChange(
                        member.id,
                        "emergencyContact",
                        e.target.value
                      )
                    }
                    placeholder="0XX-XXX-XXXX"
                    className="mt-2 border-2 border-input focus:border-secondary min-h-[48px]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {members.length < 6 && (
          <Button
            onClick={handleAddMember}
            variant="outline"
            className="w-full mt-4 border-2 border-dashed border-secondary text-secondary hover:bg-secondary/10 min-h-[48px]"
          >
            <Plus className="w-4 h-4 mr-2" />
            เพิ่มสมาชิก (สูงสุด 7 คน)
          </Button>
        )}
      </div>
    </div>
  );
};
