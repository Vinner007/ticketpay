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
          <span>👤</span> หัวหน้ากลุ่ม (Leader)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {/* ชื่อ */}
          <div>
            <Label htmlFor="leader-firstName" className="text-sm sm:text-base">
              ชื่อ <span className="text-destructive">*</span>
            </Label>
            <Input
              id="leader-firstName"
              value={leader.firstName || ""}
              onChange={(e) => onLeaderChange({ ...leader, firstName: e.target.value })}
              placeholder="ชื่อจริง"
              className={`mt-1.5 sm:mt-2 border-2 focus:border-primary min-h-[44px] sm:min-h-[48px] text-sm sm:text-base ${
                errors?.leader?.firstName ? "border-destructive" : "border-input"
              }`}
              required
            />
            {errors?.leader?.firstName && (
              <div className="flex items-center gap-1 mt-1 text-xs sm:text-sm text-destructive">
                <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{errors.leader.firstName}</span>
              </div>
            )}
          </div>

          {/* นามสกุล */}
          <div>
            <Label htmlFor="leader-lastName" className="text-sm sm:text-base">
              นามสกุล <span className="text-destructive">*</span>
            </Label>
            <Input
              id="leader-lastName"
              value={leader.lastName || ""}
              onChange={(e) => onLeaderChange({ ...leader, lastName: e.target.value })}
              placeholder="นามสกุล"
              className={`mt-1.5 sm:mt-2 border-2 focus:border-primary min-h-[44px] sm:min-h-[48px] text-sm sm:text-base ${
                errors?.leader?.lastName ? "border-destructive" : "border-input"
              }`}
              required
            />
            {errors?.leader?.lastName && (
              <div className="flex items-center gap-1 mt-1 text-xs sm:text-sm text-destructive">
                <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{errors.leader.lastName}</span>
              </div>
            )}
          </div>

          {/* นามแฝง */}
          <div>
            <Label htmlFor="leader-nickname" className="text-sm sm:text-base">
              นามแฝง (ชื่อเล่น)
            </Label>
            <Input
              id="leader-nickname"
              value={leader.nickname || ""}
              onChange={(e) => onLeaderChange({ ...leader, nickname: e.target.value })}
              placeholder="ชื่อเล่น"
              className="mt-1.5 sm:mt-2 border-2 border-input focus:border-primary min-h-[44px] sm:min-h-[48px] text-sm sm:text-base"
            />
          </div>

          {/* อีเมล */}
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

          {/* เบอร์โทรศัพท์ */}
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

          {/* อายุ */}
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

          {/* Line ID */}
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
            <span>👥</span> สมาชิกในกลุ่ม ({members.length} คน)
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {/* ชื่อ */}
                  <div>
                    <Label htmlFor={`member-${member.id}-firstName`} className="text-sm sm:text-base">
                      ชื่อ <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id={`member-${member.id}-firstName`}
                      value={member.firstName || ""}
                      onChange={(e) =>
                        handleMemberChange(member.id, "firstName", e.target.value)
                      }
                      placeholder="ชื่อจริง"
                      className={`mt-1.5 sm:mt-2 border-2 focus:border-secondary min-h-[44px] sm:min-h-[48px] text-sm sm:text-base ${
                        errors?.members?.[index]?.firstName
                          ? "border-destructive"
                          : "border-input"
                      }`}
                      required
                    />
                    {errors?.members?.[index]?.firstName && (
                      <div className="flex items-center gap-1 mt-1 text-xs sm:text-sm text-destructive">
                        <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{errors.members[index].firstName}</span>
                      </div>
                    )}
                  </div>

                  {/* นามสกุล */}
                  <div>
                    <Label htmlFor={`member-${member.id}-lastName`} className="text-sm sm:text-base">
                      นามสกุล <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id={`member-${member.id}-lastName`}
                      value={member.lastName || ""}
                      onChange={(e) =>
                        handleMemberChange(member.id, "lastName", e.target.value)
                      }
                      placeholder="นามสกุล"
                      className={`mt-1.5 sm:mt-2 border-2 focus:border-secondary min-h-[44px] sm:min-h-[48px] text-sm sm:text-base ${
                        errors?.members?.[index]?.lastName
                          ? "border-destructive"
                          : "border-input"
                      }`}
                      required
                    />
                    {errors?.members?.[index]?.lastName && (
                      <div className="flex items-center gap-1 mt-1 text-xs sm:text-sm text-destructive">
                        <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{errors.members[index].lastName}</span>
                      </div>
                    )}
                  </div>

                  {/* นามแฝง */}
                  <div>
                    <Label htmlFor={`member-${member.id}-nickname`} className="text-sm sm:text-base">
                      นามแฝง (ชื่อเล่น)
                    </Label>
                    <Input
                      id={`member-${member.id}-nickname`}
                      value={member.nickname || ""}
                      onChange={(e) =>
                        handleMemberChange(member.id, "nickname", e.target.value)
                      }
                      placeholder="ชื่อเล่น"
                      className="mt-1.5 sm:mt-2 border-2 border-input focus:border-secondary min-h-[44px] sm:min-h-[48px] text-sm sm:text-base"
                    />
                  </div>

                  {/* อายุ */}
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
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
