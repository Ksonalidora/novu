import { Accordion, Group, useMantineColorScheme } from '@mantine/core';
import { Controller, useFormContext } from 'react-hook-form';
import styled from '@emotion/styled';
import { DigestTypeEnum } from '@novu/shared';

import { When } from '../../../components/utils/When';
import { colors, Input, Select, Tooltip } from '../../../design-system';
import { Bell, Digest, Timer } from '../../../design-system/icons';
import { TypeSegmented } from './digest/TypeSegment';
import { WillBeSentHeader } from './digest/WillBeSentHeader';
import { RegularInfo } from './digest/icons/RegularInfo';
import { TimedDigestMetadata } from './TimedDigestMetadata';
import { RegularDigestMetadata } from './RegularDigestMetadata';

const GroupStyled = styled(Group)`
  gap: 18px;
`;

export const DigestMetadata = ({ index, readonly }: { index: number; readonly: boolean }) => {
  const { control, watch } = useFormContext();

  const { colorScheme } = useMantineColorScheme();

  const type = watch(`steps.${index}.digestMetadata.type`);
  const digestKey = watch(`steps.${index}.digestMetadata.digestKey`);

  return (
    <div data-test-id="digest-step-settings-interval">
      <Accordion>
        <Tooltip
          position="left"
          width={227}
          multiline
          label="Types of events that will be aggregated from the previous digest to the time it will be sent"
        >
          <Accordion.Item value="events-selection" data-test-id="digest-events-selection-options">
            <Accordion.Control>
              <GroupStyled>
                <Bell color={colors.B60} />
                <div>
                  <div>
                    <b
                      style={{
                        color: colorScheme === 'dark' ? colors.B80 : colors.B40,
                      }}
                    >
                      All events
                    </b>
                  </div>
                  <div>since previous digest</div>
                </div>
              </GroupStyled>
            </Accordion.Control>
            <Accordion.Panel>
              <Select mt={-5} mb={-5} data={[{ value: 'all', label: 'All events' }]} value={'all'} />
            </Accordion.Panel>
          </Accordion.Item>
        </Tooltip>
        <Tooltip
          position="left"
          width={227}
          multiline
          label={
            <>
              Events aggregated by subscriberId by default, this can’t be changed. You may add additional aggregations
              by typing the name of a variable.
            </>
          }
        >
          <Accordion.Item value="group-by" data-test-id="digest-group-by-options">
            <Accordion.Control>
              <GroupStyled>
                <div style={{ width: 26 }}>
                  <Digest color={colors.B60} />
                </div>
                <div>
                  <div>
                    <b>Aggregated by subscriberId</b>
                  </div>
                  <When truthy={!digestKey}>
                    <div>Add another aggregation key</div>
                  </When>
                  <When truthy={digestKey}>
                    <div>
                      And by{' '}
                      <b
                        style={{
                          color: colorScheme === 'dark' ? colors.B80 : colors.B40,
                        }}
                      >
                        {digestKey}
                      </b>
                    </div>
                  </When>
                </div>
              </GroupStyled>
            </Accordion.Control>
            <Accordion.Panel>
              <Controller
                control={control}
                name={`steps.${index}.digestMetadata.digestKey`}
                defaultValue=""
                render={({ field, fieldState }) => {
                  return (
                    <Input
                      {...field}
                      mt={-5}
                      mb={-5}
                      value={field.value || ''}
                      placeholder="Post_ID, Attribute_ID, etc."
                      error={fieldState.error?.message}
                      type="text"
                      data-test-id="batch-key"
                      disabled={readonly}
                    />
                  );
                }}
              />
            </Accordion.Panel>
          </Accordion.Item>
        </Tooltip>
        <Accordion.Item value="send" data-test-id="digest-send-options">
          <Accordion.Control>
            <GroupStyled>
              <Timer width="30" height="30" color={colors.B60} />
              <div>
                <div>
                  <b>Will be sent</b>
                </div>
                <div>
                  <WillBeSentHeader index={index} />
                </div>
              </div>
            </GroupStyled>
          </Accordion.Control>
          <Accordion.Panel>
            <Controller
              control={control}
              defaultValue={DigestTypeEnum.REGULAR}
              name={`steps.${index}.digestMetadata.type`}
              render={({ field }) => {
                return (
                  <TypeSegmented
                    {...field}
                    sx={{
                      maxWidth: '100% !important',
                      marginBottom: -14,
                    }}
                    fullWidth
                    disabled={readonly}
                    data={[
                      {
                        value: DigestTypeEnum.REGULAR,
                        label: (
                          <Tooltip
                            withinPortal
                            width={310}
                            multiline
                            offset={15}
                            label={
                              <>
                                <div>
                                  Digest starts after the first event occurred since the previous sent digest. From that
                                  moment on, it aggregates events for the specified time, after which it sends a digest
                                  of the events.
                                </div>
                                <RegularInfo />
                              </>
                            }
                          >
                            <div>Event</div>
                          </Tooltip>
                        ),
                      },
                      {
                        value: DigestTypeEnum.TIMED,
                        label: (
                          <Tooltip
                            withinPortal
                            width={240}
                            multiline
                            offset={15}
                            label="Digest aggregates the events in between the selected time period"
                          >
                            <div>Schedule</div>
                          </Tooltip>
                        ),
                      },
                    ]}
                    data-test-id="digest-type"
                  />
                );
              }}
            />
            <div
              style={{
                background: colorScheme === 'dark' ? colors.B20 : colors.BGLight,
                padding: 16,
                borderRadius: 8,
              }}
            >
              {type === DigestTypeEnum.TIMED && <TimedDigestMetadata index={index} readonly={readonly} />}
              {type === DigestTypeEnum.REGULAR && <RegularDigestMetadata index={index} readonly={readonly} />}
            </div>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};
