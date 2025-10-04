import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Leader, Member } from "@/types/booking";
import { User, AlertCircle } from "lucide-react";

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
    <div className="space-y-6 sm:space-y-8">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <User className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary flex-shrink-0" />
        <h2 className="text-xl sm:text-2xl md:text-3xl font-spooky text-primary">
          ข้อมูลสมาชิก
        </h2>
      </div>

      <div className="bg-secondary/10 border border-secondary rounded-lg p-3 sm:p-4 mb-4">
        <p className="text-xs sm:text-sm text-muted-foreground">
          📝 <strong>กำลังกรอกข้อมูล {groupSize} คน</strong> • 
          ต้องการเปลี่ยนจำนวนคน? กดปุ่ม "ย้อนกลับ" ด้านล่าง
        </p>
      </div>

      {/* Leader Section */}
      <div className="bg-card rounded-xl p-4 sm:p-6 border-2 border-primary glow-orange">
        <h3 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
          <span>👤</span> หัวหน้าทีม (Leader)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="leader-name" className="text-sm sm:text-base">
              ชื่อ-นามสกุล <span className="text-destructive">*</span>
            </Label>
            <Input
              id="leader-name"
              value={leader.name}
              onChange={(e) => onLeaderChange({ ...leader, name: e.target.value })}
              placeholder="กรอกชื่อ-นามสกุล"
              className={`mt-1.5 sm:mt-2 border-2 focus:border-primary min-h-[44px] sm:min-h-[48px] text-sm sm:text-base ${
                errors?.leader?.name ? "border-destructive" : "border-input"
              }`}
              required
            />
            {errors?.leader?.name && (
              <div className="flex items-center gap-1 mt-1 text-xs sm:text-sm text-destructive">
                <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{errors.leader.name}</span>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="leader-email" className="text-sm sm:text-base">
              อีเมล <span className="text-destructive">*</span>
            </Label>
            <Input
              id="leader-email"
              type="email"
              value={leader.email}
              onChange={(e) => onLeaderChange({ ...leader, email: e.target.value })}
              placeholder="example@email.com"
              className={`mt-1.5 sm:mt-2 border-2 focus:border-primary min-h-[44px] sm:min-h-[48px] text-sm sm:text-base ${
                errors?.leader?.email ? "border-destructive" : "border-input"
              }`}
              required
            />
            {errors?.leader?.email && (
              <div className="flex items-center gap-1 mt-1 text-xs sm:text-sm text-destructive">
                <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{errors.leader.email}</span>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="leader-phone" className="text-sm sm:text-base">
              เบอร์โทรศัพท์ <span className="text-destructive">*</span>
            </Label>
            <Input
              id="leader-phone"
              type="tel"
              value={leader.phone}
              onChange={(e) => onLeaderChange({ ...leader, phone: e.target.value })}
              placeholder="0XX-XXX-XXXX"
              className={`mt-1.5 sm:mt-2 border-2 focus:border-primary min-h-[44px] sm:min-h-[48px] text-sm sm:text-base ${
                errors?.leader?.phone ? "border-destructive" : "border-input"
              }`}
              required
            />
            {errors?.leader?.phone && (
              <div className="flex items-center gap-1 mt-1 text-xs sm:text-sm text-destructive">
                <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{errors.leader.phone}</span>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="leader-age" className="text-sm sm:text-base">
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
              className={`mt-1.5 sm:mt-2 border-2 focus:border-primary min-h-[44px] sm:min-h-[48px] text-sm sm:text-base ${
                errors?.leader?.age ? "border-destructive" : "border-input"
              }`}
              min="5"
              max="100"
              required
            />
            {errors?.leader?.age && (
              <div className="flex items-center gap-1 mt-1 text-xs sm:text-sm text-destructive">
                <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{errors.leader.age}</span>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="leader-line" className="text-sm sm:text-base">
              Line ID (ถ้ามี)
            </Label>
            <Input
              id="leader-line"
              value={leader.lineId || ""}
              onChange={(e) => onLeaderChange({ ...leader, lineId: e.target.value })}
              placeholder="line.id"
              className="mt-1.5 sm:mt-2 border-2 border-input focus:border-primary min-h-[44px] sm:min-h-[48px] text-sm sm:text-base"
            />
          </div>
        </div>
      </div>

      {/* Members Section */}
      {members.length > 0 && (
        <div>
          <h3 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
            <span>👥</span> สมาชิกในทีม ({members.length} คน)
          </h3>

          <div className="space-y-3 sm:space-y-4">
            {members.map((member, index) => (
              <div
                key={member.id}
                className="bg-card rounded-xl p-4 sm:p-6 border-2 border-border hover:border-secondary transition-colors"
              >
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-sm sm:text-base">
                    {index + 2}
                  </div>
                  <span className="font-semibold text-sm sm:text-base">
                    สมาชิกคนที่ {index + 2}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <div className="sm:col-span-2 lg:col-span-1">
                    <Label htmlFor={`member-${member.id}-name`} className="text-sm sm:text-base">
                      ชื่อ-นามสกุล <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id={`member-${member.id}-name`}
                      value={member.name}
                      onChange={(e) =>
                        handleMemberChange(member.id, "name", e.target.value)
                      }
                      placeholder="กรอกชื่อ-นามสกุล"
                      className={`mt-1.5 sm:mt-2 border-2 focus:border-secondary min-h-[44px] sm:min-h-[48px] text-sm sm:text-base ${
                        errors?.members?.[index]?.name
                          ? "border-destructive"
                          : "border-input"
                      }`}
                      required
                    />
                    {errors?.members?.[index]?.name && (
                      <div className="flex items-center gap-1 mt-1 text-xs sm:text-sm text-destructive">
                        <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{errors.members[index].name}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor={`member-${member.id}-age`} className="text-sm sm:text-base">
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
                      className={`mt-1.5 sm:mt-2 border-2 focus:border-secondary min-h-[44px] sm:min-h-[48px] text-sm sm:text-base ${
                        errors?.members?.[index]?.age
                          ? "border-destructive"
                          : "border-input"
                      }`}
                      min="5"
                      max="100"
                      required
                    />
                    {errors?.members?.[index]?.age && (
                      <div className="flex items-center gap-1 mt-1 text-xs sm:text-sm text-destructive">
                        <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{errors.members[index].age}</span>
                      </div>
                    )}
                  </div>

                  <div className="sm:col-span-2 lg:col-span-1">
                    <Label htmlFor={`member-${member.id}-emergency`} className="text-sm sm:text-base">
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
                      className="mt-1.5 sm:mt-2 border-2 border-input focus:border-secondary min-h-[44px] sm:min-h-[48px] text-sm sm:text-base"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
